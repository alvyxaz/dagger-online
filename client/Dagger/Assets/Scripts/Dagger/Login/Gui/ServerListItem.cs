using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ServerListItem : MonoBehaviour
{
    public Text ServerName;
    public ServerSelection ServerSelection;

    public Image Backgroud;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    public void OnClick()
    {
        ServerSelection.HighlightServer(this);
    }
}
