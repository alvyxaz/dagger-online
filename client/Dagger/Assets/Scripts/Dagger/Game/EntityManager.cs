using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Object = UnityEngine.Object;

public class EntityManager : MonoBehaviour {

    private Dictionary<int, WorldObject> _entities;
    private Dictionary<string, Stack<WorldObject>> _freeObjects;

    void Start()
    {
        _entities = new Dictionary<int, WorldObject>();
        _freeObjects = new Dictionary<string, Stack<WorldObject>>();
    }

    public WorldObject InstantiateObject(JSONObject view)
    {
        var prefabName = view.GetField("prefab").ToString();
        var instanceId = Convert.ToInt32(view.GetField("id").ToString());

        var newObject = TryGetPrefab(prefabName);

        if (newObject == null)
        {
            var prefab = Resources.Load("prefabs/" + prefabName);
            if (prefab == null)
            {
                return null;
            }
            var obj = (GameObject)Instantiate(prefab, new Vector3(), Quaternion.identity);
            newObject = obj.GetComponent<WorldObject>();
        }

        newObject.InitializeFromView(view);
        AddObject(newObject, prefabName);
        newObject.transform.parent = transform;

        if (!_entities.ContainsKey(instanceId))
        {
            _entities.Add(instanceId, newObject);
        }

        return newObject;
    }

    public WorldObject TryGetPrefab(string prefab)
    {
        if (_freeObjects.ContainsKey(prefab))
        {
            var stack = _freeObjects[prefab];
            if (stack.Count > 0)
            {
                return stack.Pop();
            }
        }
        return null;
    }

    public void DestroyObject(WorldObject obj)
    {
        _entities.Remove(obj.InstanceId);

        Stack<WorldObject> stack;
        if (_freeObjects.ContainsKey(obj.Prefab))
        {
            stack = _freeObjects[obj.Prefab];
        }
        else
        {
            stack = new Stack<WorldObject>();
            _freeObjects.Add(obj.Prefab, stack);
        }

        stack.Push(obj);
    }

    public WorldObject GetObject(int id)
    {
        WorldObject temp;
        _entities.TryGetValue(id, out temp);
        return temp;
    }

    public void AddObject(WorldObject obj, string prefab)
    {
        if (!_entities.ContainsKey(obj.InstanceId))
        {
            _entities.Add(obj.InstanceId, obj);
        }
    }
}
