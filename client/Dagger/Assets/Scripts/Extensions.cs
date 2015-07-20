using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

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
