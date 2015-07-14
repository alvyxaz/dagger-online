using UnityEngine;
using System.Collections;

public class GameController : MonoBehaviour, IMessageListener
{
    public IConnectionController Connection;

    public Player Player;

	// Use this for initialization
	void Start () {
        Connection = FindObjectOfType<ConnectionController>();

        if (Connection == null || !Connection.IsConnected)
        {
            Application.LoadLevel("login");
            return;
        }

        DontDestroyOnLoad(this);
	    DontDestroyOnLoad(Player);

        // Setup player
	    Player.transform.position = PersistentData.ZoneLoadData.PlayerPosition;

        Application.LoadLevel("world");
    }
	
	// Update is called once per frame
	void Update () {
	
	}

    public void OnMessageReceived(JSONObject message)
    {
        Debug.Log(message);
    }

}
