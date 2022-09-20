using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SwapHandler : MonoBehaviour
{
    public GameObject Fixture1;
    public GameObject Fixture2; 

    bool show1 = true;
    bool show2 = false;

    public void SetFixture(string name)
    {
        Debug.Log("Set Fixture: " + name);
        
        if(name.Equals("1"))
        {
            Fixture1.SetActive(false);
            Fixture2.SetActive(true);
        } 
        else
        {
            Fixture1.SetActive(true);
            Fixture2.SetActive(false);
        } 
        
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Fixture 1: " + Fixture1.name);
        Debug.Log("Fixture 2: " + Fixture2.name);

        //_Object1.SetActive(show1);
        //_Object2.SetActive(show2);
    }

    // Update is called once per frame
    void Update()
    {
       
    }
}