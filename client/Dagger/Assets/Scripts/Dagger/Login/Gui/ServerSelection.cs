using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public class ServerSelection : MonoBehaviour
{
    public ServerListItem SampleItem;
    public Transform ServerListGroup;
    public List<ServerListItem> Servers;

    private ServerListItem _selectedItem;

    private Color _normalColor = new Color(1, 1, 1, 1);
    private Color _highlightColor = new Color(178/255f, 231/255f, 161/255f, 1);

    private ConnectionController _connection;

    public bool ShowInEditor;
    public LoginController LoginController;

    void Start()
    {
        if (Application.isPlaying)
        {
            _connection = ConnectionController.Instance;
            Servers = new List<ServerListItem>();
            Servers.Add(SampleItem);
            gameObject.SetActive(false);
            LoginController = FindObjectOfType<LoginController>();
        }
        else
        {
            gameObject.SetActive(ShowInEditor);
        }
    }

    public void Display(IEnumerable<string> servers)
    {
        var index = 0;
        foreach (var server in servers)
        {
            ServerListItem item = null;
            if (index < Servers.Count)
            {
                item = Servers[index];
            }
            else
            {
                item = Instantiate(SampleItem);
                Servers.Add(item);
            }

            item.ServerName.text = server;
            item.transform.SetParent(ServerListGroup, false);
            item.ServerSelection = this;
            item.gameObject.SetActive(true);
            index++;
        }

        // Hide items that were not used
        while (index < Servers.Count)
        {
            Servers[index].gameObject.SetActive(false);
            index++;
        }

        if (Servers.Count > 0)
        {
        }

        gameObject.SetActive(true);
    }

    public void HighlightServer(ServerListItem item)
    {
        if (_selectedItem != null)
        {
            // Reset color
            _selectedItem.Backgroud.color = _normalColor;
        }

        _selectedItem = item;

        if (item != null)
        {
            item.Backgroud.color = _highlightColor;
        }
    }

    public void OnSelectClick()
    {
        if (_selectedItem != null)
        {
            _connection.SendMessage(MessageCode.ServerSelect, new JSONObject(new Dictionary<string, string>()
            {
                {"server", _selectedItem.ServerName.text}
            }), message =>
            {
                PlayerPrefs.SetString("credentials", message.ToString());
                LoginController.ConnectToLastServer();
            });
        }
        else
        {
            Debug.Log("No server selected");
        }
    }
}
