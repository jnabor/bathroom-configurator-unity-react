using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using TMPro;

public class SwapHandler : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SetSelection (string selection);

    public GameObject Fixture1;
    public GameObject Fixture2;
    public GameObject Fixture3; 

    public TMP_Text m_TextComponent1;
    public TMP_Text m_TextComponent2;
    public TMP_Text m_TextComponent3;


    public void SetFixture(string name)
    {
        Debug.Log("Set Fixture: " + name);
        Fixture1.SetActive(false);
        Fixture2.SetActive(false);
        Fixture3.SetActive(false);

        m_TextComponent1.color = new Color32(251, 155, 127, 255);
        m_TextComponent2.color = new Color32(251, 155, 127, 255);
        m_TextComponent3.color = new Color32(251, 155, 127, 255);

        if(name.Equals("1"))
        {
            Fixture1.SetActive(true);
            m_TextComponent1.color = new Color32(254, 124, 85, 255);
        } 

        if(name.Equals("2"))
        {
            Fixture2.SetActive(true);
            m_TextComponent2.color = new Color32(254, 124, 85, 255);
        } 

        if(name.Equals("3"))
        {
            Fixture3.SetActive(true);
            m_TextComponent3.color = new Color32(254, 124, 85, 255);
        } 

#if UNITY_WEBGL == true && UNITY_EDITOR == false
        Debug.Log("Dispatch Set Selection: " + name);
        SetSelection(name);
#endif
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Fixture 1: " + Fixture1.name);
        Debug.Log("Fixture 2: " + Fixture2.name);
        Debug.Log("Fixture 3: " + Fixture3.name);

        Fixture1.SetActive(true);
        Fixture2.SetActive(false);
        Fixture3.SetActive(false);

        m_TextComponent1.color = new Color32(254, 124, 85, 255);
        m_TextComponent2.color = new Color32(251, 155, 127, 255);
        m_TextComponent3.color = new Color32(251, 155, 127, 255);
    }

    // Update is called once per frame
    void Update()
    {
       
    }
}