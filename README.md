# WAB_SmartEditor-Tideflats_SP-Widget
SmartEditor widget for Tideflats Subarea Plan: https://wspdsmap.cityoftacoma.org/website/PDS/Tideflats/

1. Copy config_widgets_SmartEditor_Widget_31.json to folder \configs\SmartEditor\ (NOTE: Add alias to config file (not an option in WAB):  "label": "Contact Info (Optional)",  (Automatic in WAB upgrade))
2. Copy popup.css to folder \jimu.js\css\ (remove edit ability from map marker popup - .popup-menu-button /*MJM*/)
3. Copy strings.js to folder \widgets\SmartEditor\nls\strings.js (changes editGeometry value to " Allow movement of point") 
4. Copy Widget.js to folder \widgets\SmartEditor\ (Add to onOpen a toggle Summary button off to start editing. | Modify  _workBeforeCreate function - Remove snapping text from mouse tooltip.)

