using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SwapHandler : MonoBehaviour
{
    public GameObject Fixture1;
    public GameObject Fixture2;
    public GameObject Fixture3; 


    public void SetFixture(string name)
    {
        Debug.Log("Set Fixture: " + name);
        Fixture1.SetActive(false);
        Fixture2.SetActive(false);
        Fixture3.SetActive(false);

        if(name.Equals("1"))
        {
            Fixture1.SetActive(true);
        } 

        if(name.Equals("2"))
        {
            Fixture2.SetActive(true);
        } 

        if(name.Equals("3"))
        {
            Fixture3.SetActive(true);
        } 
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Fixture 1: " + Fixture1.name);
        Debug.Log("Fixture 2: " + Fixture2.name);
        Debug.Log("Fixture 3: " + Fixture3.name);
    }

    // Update is called once per frame
    void Update()
    {
       
    }
}