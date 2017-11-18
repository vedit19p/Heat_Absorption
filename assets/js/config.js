/** 
 *  MISC APPLICATION SETTINGS
 */


var audioDirectory = 'assets/audio/';

var activityAudioIntro = 'intro.mp3';
var activityAudioSafety = 'safety.mp3';


/** 
 * VIDEOS  
 */
var videos = [
    {
        id: 'vid1',
        title: 'Using the Simulation',
        src: 'intro_video'
    },
    {
        id: 'vid2',
        title: 'Understanding the Equipment',
        src: 'act_video'            
    }
];


/*  
 *  ICON BAR ICONS
 *  Generates all the required icons for this module based on the configured data. 
*/
var iconBarIcons = [
    { 
        optional: [
            { id: "partsDepartmentIcon", title: "Parts Department", active: false },
            { id: "toolTrayIcon", title: "Tool Tray", active: false },
            { id: "serviceInfoIcon", title: "Service Information", active: false },           
            { id: "zoomInIcon", title: "Zoom In", active: false },
            { id: "zoomOutIcon", title: "Zoom Out", active: false }   
        ],
        standard: [    
            { id: "muteIcon", title: "Mute On/Off" },
            { id: "audioRepeatIcon", title: "Repeat Audio" },
            { id: "ccIcon", title: "Closed Caption" },
            { id: "menuIcon", title: "Menu" },
            { id: "closeIcon", title: "Close" }
        ]
    }
];

// SI Menu Data
siMenuData = [ 
    {
        item: 'BCM Circuit Diagram',
        img: 'assets/images/Testing_BCM_Power/service_information/BCM_circuit_diagram.png',
        id: 's1',
        activity: '1'
    },
    {
        item: 'A3 Connector Diagram Model',
        img: 'assets/images/Testing_BCM_Power/service_information/A3_Connector_Diagram_Model.png',
        id: 's2',
        activity: '2'
    },
    {
        item: 'Body Control Module A1',
        img: 'assets/images/Testing_BCM_Power/service_information/si2.png',
        id: 's3',
        activity: '2'
    },
    {
        item: 'A3 Connector View',
        img: 'assets/images/Testing_BCM_Power/service_information/A3_Connector_view.png',
        id: 's4',
        activity: '2'
    },
    {
        item: 'A1 Connector Diagram Model',
        img: 'assets/images/Testing_BCM_Power/service_information/A1_Connector_Diagram_Model.png',
        id: 's5',
        activity: '2'
    },


    {
        item: 'Trunk Motor Circuit Diagram',
        img: 'assets/images/Testing_BCM_Power/service_information/Trunk_Motor_Circuit_Diagram.png',
        id: 's6',
        activity: '3'
    },
    {
        item: 'Fusebox Legend',
        img: 'assets/images/Testing_BCM_Power/service_information/Fusebox_Legend.png',
        id: 's7',
        activity: '3'
    },
    // Video
    {
        item: 'Relay',
        video: 'relay_video',
        id: 's8',
        activity: '3'
    },
    {
        item: 'Relay Connector Diagram',
        img: 'assets/images/Testing_BCM_Power/service_information/Relay_Connector_Diagram.png',
        id: 's9',
        activity: '3'
    },
];