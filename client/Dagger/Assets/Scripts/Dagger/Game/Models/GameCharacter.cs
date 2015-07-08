using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public class GameCharacter : WorldObject
{
    public bool IsMoving { get; set; }

    private Vector3 _startPosition;
    private float _startTime;
    private Vector3 _movementLocation;
    private float _movementDuration;

    public Animator Animator;

    public float AnimationSpeed = 1f;

    public override void OnStart()
    {
        base.OnStart();
        Animator = GetComponentInChildren<Animator>();
        if (Animator != null)
        {
            Animator.speed = AnimationSpeed;
        }
        _movementLocation = new Vector2();
    }

    public void MoveTo(float x, float y, float movementDuration)
    {
        _movementLocation.x = x;
        _movementLocation.y = y;
        _movementLocation.y = HelperMethods.CalculateZ(y);
        _movementDuration = movementDuration;
        _startPosition = transform.position;
        _startTime = Time.time;
        StartMoving();

    }

    public override void OnUpdate()
    {
        base.OnUpdate();

        if (IsMoving)
        {
            if (_movementDuration > 0)
            {
                float timePassed = (Time.time - _startTime) / _movementDuration;
                transform.position = Vector2.Lerp(_startPosition, _movementLocation, timePassed);
                if (timePassed > 1)
                {
                    StopMoving();
                }
            }
        }
    }

    public void StartMoving()
    {
        IsMoving = true;
        if (Animator != null)
        {
            Animator.SetBool("Moving", true);
        }
    }

    public void StopMoving()
    {
        _movementDuration = 0;
        IsMoving = false;
        if (Animator != null)
        {
            Animator.SetBool("Moving", false);
        }
    }
}