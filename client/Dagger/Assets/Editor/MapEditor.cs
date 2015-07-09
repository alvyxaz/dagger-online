using System;
using UnityEngine;
using System.Collections;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Sprites;

public class MapEditor : EditorWindow {

    public string Name = "World";
    public string MaxPlayers = "100";
    public string ZoneType = "World";

    public string VisibleRange = "10";
    public string ForgetRange = "20";

    [MenuItem("Dagger/MapEditor")]
    public static void ShowWindoW()
    {
        EditorWindow.GetWindow(typeof(MapEditor));
    }

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnGUI()
    {
        GUILayout.Label("General Settings", EditorStyles.boldLabel);
        EditorGUILayout.TextField("Name", Name);
        EditorGUILayout.TextField("Max Players", MaxPlayers);
        EditorGUILayout.TextField("Zone Type", ZoneType);

        GUILayout.Label("Area", EditorStyles.boldLabel);

        EditorGUILayout.TextField("Visible Range", VisibleRange);
        EditorGUILayout.TextField("Forget Range", ForgetRange);


        GUILayout.Label("Export Map", EditorStyles.boldLabel);

        if (GUILayout.Button("Print JSON"))
        {
            Debug.Log(GenerateJson().ToString());
        }

        if (GUILayout.Button("Export JSON"))
        {
            var path = EditorUtility.SaveFilePanel("Title", "Directory", "map", "json");
            if (path.Length > 0)
            {
                Debug.Log(path);
                File.WriteAllText(path, GenerateJson().ToString());
            }
        }
    }

    public JSONObject GenerateJson()
    {
        var json = new JSONObject(JSONObject.Type.OBJECT);

        json.AddField("name", Name);
        json.AddField("maxPlayers", MaxPlayers);
        json.AddField("type", ZoneType);

        json.AddField("area", new JSONObject(delegate(JSONObject request)
        {
            request.AddField("visibleRange", VisibleRange);
            request.AddField("forgetRange", ForgetRange);
        }));


        json.AddField("positions", GeneratePositionsJson());
        json.AddField("data", GenerateDataJson());
        return json;
    }

    public JSONObject GeneratePositionsJson()
    {
        var array = new JSONObject(JSONObject.Type.ARRAY);

        var startPos = GameObject.Find("StartPosition");

        if (startPos)
        {
            array.Add(new JSONObject(delegate(JSONObject obj)
            {
                obj.AddField("name", "start");
                obj.AddField("position", startPos.transform.position.ToJson());
            }));
        }
        else
        {
            Debug.LogError("No start position found");
        }

        return array;
    }

    public JSONObject GenerateDataJson()
    {
        var json = new JSONObject(JSONObject.Type.OBJECT);
        // ----------------------------------------------------
        // Static Images
        var imagesContainer = GameObject.Find("StaticImages");
        var allImages = imagesContainer.GetComponentsInChildren<Transform>().Where(StaticImage.IsStaticImage);
        var staticImages = new JSONObject(JSONObject.Type.ARRAY);
        foreach (var imageObject in allImages)
        {
            var image = new StaticImage(imageObject);
            staticImages.Add(image.ToJson());
        }
        json.AddField("staticImages", staticImages);

        return json;
    }

    public class MapData
    {
        public JSONObject ToJson()
        {
            return new JSONObject();
        }

        public static MapData FromJson(JSONObject json)
        {
            return new MapData();
        }
    }

    public class StaticImage
    {
        public Vector3 Position;
        public Vector3 Scale;
        public Vector3 Rotation;

        public Color Color;
        public string SpriteName;
        public string ObjectName;

        public StaticImage(Transform obj)
        {
            Position = obj.transform.position;
            Scale = obj.transform.localScale;
            Rotation = obj.transform.eulerAngles;

            var sprite = obj.GetComponent<SpriteRenderer>();
            Color = sprite.color;
            SpriteName = sprite.sprite.name;
            ObjectName = obj.name;
        }

        public static bool IsStaticImage(Transform obj)
        {
            return obj.GetComponent<SpriteRenderer>() != null;
        }

        public JSONObject ToJson()
        {
            var json = new JSONObject();

            json.AddField("p", Position.ToJson());
            json.AddField("s", Position.ToJson());
            json.AddField("r", Position.ToJson());

            json.AddField("c", Color.ToString());
            json.AddField("sN", SpriteName);
            json.AddField("sO", ObjectName);

            return json;
        }
    }
}

public static class Extensions
{
    public static JSONObject ToJson(this Vector3 vec)
    {
        var json = new JSONObject(JSONObject.Type.ARRAY);
        json.Add(vec.x);
        json.Add(vec.y);
        json.Add(vec.z);
        return json;
    }
}