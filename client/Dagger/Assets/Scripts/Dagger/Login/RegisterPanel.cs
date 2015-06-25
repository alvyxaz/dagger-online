using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class RegisterPanel : MonoBehaviour
{

    public InputField Username;
    public InputField Password;
    public InputField RepeatPassword;
    public InputField Email;

    public Button RegisterButton;

	// Use this for initialization
	void Start () {
	
	}

    public bool IsValid()
    {
        return Username.text.Length > 3
               && Password.text.Length > 3
               && Password.text.Equals(RepeatPassword.text)
               && Email.text.Length > 3;
    }
}
