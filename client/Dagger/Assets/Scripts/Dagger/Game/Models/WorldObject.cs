using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

/// <summary>
/// Represents a basic object in a world
/// </summary>
public class WorldObject : MonoBehaviour
{
    public int InstanceId { get; set; }
    public string Name { get; set; }
    public string Prefab { get; set; }
    public GameObjectType ObjectType { get; set; }
    protected Vector3 CurrentPosition;
    public GameObject TargetPosition;
    public ObjectHintType Hint;

    void Awake()
    {
        OnAwake();
    }

    void Start()
    {
        CurrentPosition = new Vector3();
        OnStart();
    }

    void Update()
    {
        OnUpdate();
        UpdateZ();
    }

    public virtual void UpdateZ()
    {
        CurrentPosition.x = transform.position.x;
        CurrentPosition.y = transform.position.y;
        CurrentPosition.z = HelperMethods.CalculateZ(CurrentPosition.y);
        transform.position = CurrentPosition;
    }

    public virtual void InitializeFromView(JSONObject view)
    {
        Name = view.GetField("name").ToString();
        InstanceId = Convert.ToInt32(view.GetField("id").ToString());
        transform.position = HelperMethods.PositionFromJSONArray(view.GetField("position"));
        Prefab = view.GetField("prefab").ToString();
    }

    void OnClick()
    {
        //Dictionary<byte, object> para = new Dictionary<byte, object>();
        //para.Add((byte)ClientParameterCode.SubOperationCode, MessageSubCode.TargetRequest);
        //para.Add((byte)ClientParameterCode.InstanceId, InstanceId);
        //_gameController.SendOperation(
        //    new OperationRequest() { OperationCode = (byte)ClientOperationCode.Game, Parameters = para }, true, 0, false);
    }

    public virtual void PrepareForDestruction()
    {

    }

    public virtual void OnAwake()
    {
    }

    public virtual void OnStart()
    {
    }

    public virtual void OnUpdate()
    {
    }

}
