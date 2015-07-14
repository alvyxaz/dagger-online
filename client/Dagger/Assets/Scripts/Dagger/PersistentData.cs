using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public class PersistentData
{
    public static ZoneLoadData ZoneLoadData;
}

public class ZoneLoadData
{
    public Vector3 PlayerPosition;
    public string ZoneName;
    public string SceneName;

    public ZoneLoadData(Vector3 playerPos, string zoneName, string sceneName)
    {
        PlayerPosition = playerPos;
        ZoneName = zoneName;
        SceneName = sceneName;
    }
}