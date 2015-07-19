using UnityEngine;

public class HelperMethods
{
    private const float MAX_Y = 1000;
    private const float MAX_Z = 1000;

    public static float CalculateZ(float y)
    {
        return (y / MAX_Y) * MAX_Z;
    }


    public static Vector3 PositionFromJSONArray(JSONObject posArray)
    {
        return new Vector3(
                float.Parse(posArray[0].ToString()),
                float.Parse(posArray[1].ToString()));
    }
}