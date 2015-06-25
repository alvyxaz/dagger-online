using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class LoginPanel : MonoBehaviour
{
    public InputField Username;
    public InputField Password;
    public Button LoginButton;

	// Use this for initialization
	void Start () {
	
	}

    public bool IsValid()
    {
        return Username.text.Length > 3
               && Password.text.Length > 3;
    }

}
