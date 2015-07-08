using System;
using UnityEngine;
using System.Collections;

public class DirectionManager : MonoBehaviour
{
    public GameObject Ellipse;
    public GameObject Arrow;

    private Transform _transform;
    private Vector3 _rotation;

    // Use this for initialization
    void Start()
    {
        _transform = transform;
        _rotation = transform.localEulerAngles;
    }

    // Update is called once per frame
    void Update()
    {

    }

    public float Angle
    {
        get { return _rotation.z; }
        set
        {
            _rotation.z = value;
            _transform.localEulerAngles = _rotation;
        }
    }
}
