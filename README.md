# WAB_SmartEditor-Tideflats_SP-Widget
SmartEditor widget for Tideflats Subarea Plan: https://wspdsmap.cityoftacoma.org/website/PDS/Tideflats/

   A. NOTE: Add alias to config file (not an option in WAB):  "label": "Contact Info (Optional)",  (Automatic in WAB upgrade)
   B. Modify Widget.js with //MJM sections:
      1. Add to onOpen a toggle Summary button off to start editing. 
      2. Modify  _workBeforeCreate function - Remove snapping text from mouse tooltip.
   C. Modify \widgets\SmartEditor\nls\strings.js change editGeometry value to " Allow movement of point" 
   D. Modify \jimu.js\css\popup.css to remove edit ability from map marker popup - .popup-menu-button /*MJM*/

