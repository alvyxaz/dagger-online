using System;
using UnityEngine;
using System.Collections;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Sprites;

public class MapEditor : EditorWindow {
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
        GUILayout.Label("Export options", EditorStyles.boldLabel);

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
    public static string ToJson(this Vector3 vec)
    {
        return String.Format("[{0},{1},{2}]", vec.x, vec.y, vec.z);
    }
}