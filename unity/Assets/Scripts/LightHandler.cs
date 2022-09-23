using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using TMPro;

public class LightHandler : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SetSelection (string selection);

    public GameObject Light1;
    public GameObject Light2;

    public TMP_Text m_TextComponent;
    private bool lighting = false;

    public void ToggleLighting()
    {
        lighting = !lighting;
        Debug.Log("Set Lighting: " + lighting);

        Light1.SetActive(lighting);
        Light2.SetActive(lighting);

        if(lighting)
        {
            m_TextComponent.color = new Color32(254, 124, 85, 255);
        }
        else
        {
            m_TextComponent.color = new Color32(251, 155, 127, 255);
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        Light1.SetActive(lighting);
        Light2.SetActive(lighting);
    }

    // Update is called once per frame
    void Update()
    {
       
    }
}