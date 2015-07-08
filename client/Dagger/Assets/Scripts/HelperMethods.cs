public class HelperMethods
{
    private const float MAX_Y = 1000;
    private const float MAX_Z = 1000;

    public static float CalculateZ(float y)
    {
        return (y / MAX_Y) * MAX_Z;
    }
}