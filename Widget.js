///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

// jscs:disable validateIndentation
/* jshint proto: true */

define([
  "dojo/Stateful",
  'dojo',
  'dijit',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/query',
  'dojo/aspect',
  'dojo/i18n!esri/nls/jsapi',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/on',
  'dojo/keys',
  'dojo/json',
  'dojo/topic',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'jimu/LayerInfos/LayerInfos',
  'jimu/dijit/Message',
  "esri/request",
  "esri/dijit/editing/TemplatePicker",
  "esri/dijit/AttributeInspector",
  "esri/toolbars/draw",
  "esri/toolbars/edit",
  "esri/tasks/query",
  "esri/graphic",
  "esri/layers/FeatureLayer",
  "dojo/promise/all",
  "dojo/Deferred",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "esri/geometry/jsonUtils",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/tasks/RelationshipQuery",
  "dijit/registry",
  "./PresetAllFields",
  "./utils",
  "./presetUtils",
  "./presetBuilderBackwardCompatibility",
  "./smartAttributes",
  "./attributeInspectorTools",
  "./relatedTables",
  "jimu/dijit/CheckBox",
  "dijit/form/Button",
  "dijit/form/DropDownButton",
  'dijit/DropDownMenu',
  "dijit/MenuItem",
  'dijit/form/DateTextBox',
  'dijit/form/NumberSpinner',
  'dijit/form/NumberTextBox',
  'dijit/form/FilteringSelect',
  'dijit/form/TextBox',
  'dijit/form/ValidationTextBox',
  'dijit/form/TimeTextBox',
  "dijit/Editor",
  "dijit/form/SimpleTextarea",
  'dojo/store/Memory',
  'dojo/date/stamp',
  "dojo/dom-attr",
  "jimu/dijit/Popup",
  "./AttachmentUploader",
  "esri/lang",
  "esri/renderers/jsonUtils",
  "dojox/html/entities",
  'jimu/utils',
  'jimu/portalUrlUtils',
  'jimu/SelectionManager',
  './SEFilterEditor',
  './SEDrawingOptions',
  './PrivilegeUtil',
  './XYCoordinates',
  'jimu/dijit/LoadingIndicator',
  'esri/tasks/GeometryService',
  "./coordinateUtils",
  "./addressUtils",
  "./Intersection",
  "esri/dijit/LocateButton",
  "esri/geometry/Point",
  'esri/SpatialReference',
  "dijit/focus",
  'jimu/dijit/FeatureSetChooserForMultipleLayers',
  "./copy-features",
  "dojo/string"
],
  function (
    Stateful,
    dojo,
    dijit,
    declare,
    lang,
    array,
    html,
    query,
    aspect,
    esriBundle,
    dom,
    domConstruct,
    domClass,
    domStyle,
    on,
    keys,
    JSON,
    topic,
    _WidgetsInTemplateMixin,
    BaseWidget,
    LayerInfos,
    Message,
    esriRequest,
    TemplatePicker,
    AttributeInspector,
    Draw,
    Edit,
    Query,
    Graphic,
    FeatureLayer,
    all,
    Deferred,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Color,
    geometryJsonUtil,
    Polyline,
    Polygon,
    RelationshipQuery,
    registry,
    PresetAllFields,
    editUtils,
    presetUtils,
    presetBuilderBackwardCompatibility,
    smartAttributes,
    attributeInspectorTools,
    relatedTables,
    CheckBox,
    Button,
    DropDownButton,
    DropDownMenu,
    MenuItem,
    DateTextBox,
    NumberSpinner,
    NumberTextBox,
    FilteringSelect,
    TextBox,
    ValidationTextBox,
    TimeTextBox,
    Editor,
    SimpleTextarea,
    Memory,
    dojoStamp,
    domAttr,
    Popup,
    AttachmentUploader,
    esriLang,
    rendererJsonUtils,
    entities,
    utils,
    portalUrlUtils,
    SelectionManager,
    SEFilterEditor,
    SEDrawingOptions,
    PrivilegeUtil,
    XYCoordinates,
    LoadingIndicator,
    GeometryService,
    coordinateUtils,
    AddressUtils,
    Intersection,
    LocateButton,
    Point,
    SpatialReference,
    focusUtil,
    FeatureSetChooserForMultipleLayers,
    CopyFeatures,
    String) {
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'SmartEditor',
      baseClass: 'jimu-widget-smartEditor',
      _defaultStartStr: "",
      _defaultAddPointStr: "",
      _jimuLayerInfos: null,
      _mapClick: null,
      settings: null,
      templatePicker: null,
      attrInspector: null,
      editToolbar: null,
      _isDirty: false,
      updateFeatures: [],
      currentFeature: null,
      currentLayerInfo: null,
      _attrInspIsCurrentlyDisplayed: false,
      _ignoreEditGeometryToggle: false,
      _editingEnabled: false,
      _usePresetValues: false,
      _creationDisabledOnAll: false,
      _editGeomSwitch: null,
      _autoSaveRuntime: false,
      _userHasPrivilege: false,
      _eventHandler: null,
      _createOverDef: null,
      featureReductionEnabledLayers: [],
      rendererDifferentLayers: [],
      clusterState: true,
      _relatedTablesInfo: {},
      _traversal: [],
      _nodesCollection: [],
      _paginationNodeCollection: [],
      _buttonsWrapper: [],
      _attributeInspectorCollection: [],
      contentWrapper: null,
      viewedFeatureDetails: [],
      viewedLayerDetails: [],
      currentAction: null,
      _isPresetTableCreated: false,
      _layerClearSelectionHandles: [],
      _layerChangedOutside: false,
      _refreshButton: null, // to store the object of refresh button
      _mapNavigation: null, // to store the object of map navigation button
      _locateButtonDiv: null, // to store the object of locate button
      _xyCoordinates: null, // to store the object of custom coordinates button
      _coordinates: null,//to store instance of XYCoordinates
      _selectTool: null,
      //widget_loaded: declare([Stateful], {
      //  loaded: null,
      //  _loadedGetter: function () {
      //    return this.loaded;
      //  },
      //  _loadedSetter: function (value) {
      //    this.loaded = value;
      //  }
      //}),
      postMixInProperties: function () {
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this.nls = lang.mixin(this.nls, window.jimuNls.timeUnit);
      },

      postCreate: function () {
        this.inherited(arguments);
        this._relatedTablesInfo = {};
        this._traversal = [];
        this._nodesCollection = [];
        this._paginationNodeCollection = [];
        this._buttonsWrapper = [];
        this._attributeInspectorCollection = [];
        this.viewedFeatureDetails = [];
        this.viewedLayerDetails = [];
        this._isPresetTableCreated = false;
        this._layerClearSelectionHandles = [];
        this._layerChangedOutside = false;
        this._selectTool = null;
        //wire up the button events
        this.own(on(this.cancelButton, "click", lang.hitch(this, function () {
          this._performCancelButtonOperation();
        })));
        //On keydown event show associated fields message in MessageBox(for clear button)
        this.own(on(this.cancelButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._performCancelButtonOperation();
          }
        })));
        domAttr.set(registry.byId("savePresetValueSwitch").domNode, "aria-label", this.nls.usePresetValues);
        domAttr.set(registry.byId("autoSaveSwitch").domNode, "aria-label", this.nls.autoSaveEdits);
      },

      _performCancelButtonOperation: function () {
        //check if needs to display prompt for unsaved edits
        if (this.config.editor.displayPromptOnSave && this._validateFeatureChanged()) {
          var isFirstPage = this._traversal.length > 1 ? false : true;
          this._promptToResolvePendingEdit(isFirstPage, null, true).then(
            lang.hitch(this, function (clickedButton) {
              //if adding new related record the task of back button(_onCancelButtonClicked)
              //should be processed after adding related record and showing list related records
              //So process _onCancelButtonClicked only when action is 'no' & not adding related record
              //if adding related record and clicked button is 'yes' then raise the flag of back button
              //so that once related record is added after that _onCancelButtonClicked will be called
              if (!this._addingNewRelatedRecord || clickedButton === "no") {
                this._onCancelButtonClicked();
              } else {
                this._processBackButtonInNewRelatedRecord = true;
              }
              this._setWidgetFirstFocusNode("templatePicker", true);
            }), function () {
            });
        } else {
          this._onCancelButtonClicked();
        }
      },

      _setCancelButtonText: function () {
        if (this._traversal && this._traversal.length > 1) {
          domAttr.set(this.cancelButton, "innerHTML", this.nls.back);
          domAttr.set(this.cancelButton, "aria-label", this.nls.back);
        } else {
          domAttr.set(this.cancelButton, "innerHTML", this.nls.clearSelection);
          domAttr.set(this.cancelButton, "aria-label", this.nls.clearSelection);
        }
      },

      _onCancelButtonClicked: function () {
        //clear previous selections of layer
        if (this.attrInspector) {
          //as now prev attribute inspector could have multiple features of multiple layer
          //clear selections of all layers in layer infos
          if (this.attrInspector.layerInfos) {
            array.forEach(this.attrInspector.layerInfos, function (layerInfo) {
              var layer = layerInfo.featureLayer;
              layer.clearSelection();
              layer.refresh();
            });
          }
          this.attrInspector.destroy();
        }
        domConstruct.destroy(this.contentWrapper);
        domConstruct.destroy(this.buttonHeader);
        if (this.navButtonsDiv) {
          domConstruct.destroy(this.navButtonsDiv);
        }
        //get prev Attribute inspector if going back from related layer/tables
        if (this._attributeInspectorCollection && this._attributeInspectorCollection.length > 0) {
          var prevAttrInspector = this._attributeInspectorCollection.pop();
          if (prevAttrInspector) {
            this.attrInspector = prevAttrInspector;
          }
        }
        if (this._traversal && this._traversal.length > 0) {
          this._traversal.pop();
        }
        if (this._buttonsWrapper.length > 0) {
          this.buttonHeader = this._buttonsWrapper.pop();
        }
        this._setCancelButtonText();
        this._unLockMapNavigation();
        //get prev ContentWrapper if going back from related layer/tables
        if (this._nodesCollection && this._nodesCollection.length > 0) {
          var prevContentWrapper = this._nodesCollection.pop();
          var prevPaginationWrapper = this._paginationNodeCollection.pop();
          if (prevContentWrapper) {
            domClass.remove(prevContentWrapper, "hidden");
            domClass.remove(this.buttonHeader, "hidden");
            //when AI's dom is set to hidden all its node get hidden so show then
            domStyle.set(this.attrInspector.attributeTable, "display", "block");
            domStyle.set(this.attrInspector.editButtons, "display", "block");
            if (this.attrInspector._attachmentEditor !== undefined &&
              this.attrInspector._attachmentEditor !== null) {
              domStyle.set(this.attrInspector._attachmentEditor.domNode, "display", "block");
            }
            //Hide Attribute inspector's delete button text shown when we block editButtons
            domStyle.set(this.attrInspector.deleteBtn.domNode, "display", "none");
            //set the prev selected feature index which is stored before navigating to shoe related records
            this.attrInspector._featureIdx = this.attrInspector.ctStoredFeatureIndex;
            //refresh the AI this will update the UI also
            this.attrInspector.refresh();
            //after time out
            // 1. Show/hide navButtons as per number of features selected
            // 2. Show number of features in nav buttons control
            setTimeout(lang.hitch(this, function () {
              //Show/hide navButtons as per number of features selected
              domStyle.set(this.attrInspector.navButtons, "display",
                (!this.attrInspector._hideNavButtons && (this.attrInspector._numFeatures > 1) ? "" : "none"));
              //Show number of features in nav buttons control
              this.attrInspector.navMessage.innerHTML = esriLang.substitute({
                idx: this.attrInspector._featureIdx + 1,
                of: this.attrInspector.NLS_of,
                numFeatures: this.attrInspector._numFeatures
              }, this.attrInspector._navMessage);
              this._toggleAttrInspectorNavButtons();
              //also update the current feature
              this.currentFeature = this.attrInspector._numFeatures ?
                this.attrInspector._selection[this.attrInspector._featureIdx] : null;
              this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
              this.currentLayerInfo = this._getLayerInfoByID(this.currentFeature._layer.id);
              // Update related records count
              if (this._relatedTablesInfo && this._relatedTablesInfo[this.currentFeature._layer.id]) {
                this._relatedTablesInfo[this.currentFeature._layer.id].updateRelatedRecordsCount();
              }
              this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate ||
                (this.currentLayerInfo.featureLayer.hasZ && !this.currentLayerInfo.featureLayer.enableZDefaults) ||
                (this.currentLayerInfo.featureLayer.hasM && !this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues));
              //Set the layer title state based on visibility
              if (this._traversal.length <= 1) {
                var layerTitleNode;
                layerTitleNode = query(".esriCTItemTitle", this.domNode)[0];
                if (this.currentFeature && this.currentFeature.geometry &&
                  this.currentFeature._layer.visibleAtMapScale) {
                  layerTitleNode.style.opacity = "1";
                } else {
                  layerTitleNode.style.opacity = "0.3";
                }
              }
              //Show hide delete button based on configuration
              if (this.currentFeature.hasOwnProperty("allowDelete")) {
                this._toggleDeleteButton(this.currentFeature.allowDelete &&
                  this.currentLayerInfo.allowDelete);
              }
              else {
                this._toggleDeleteButton(this.currentLayerInfo.allowDelete);
              }
              if (this.currentLayerInfo.featureLayer.visibleAtMapScale &&
                this.config.editor.hasOwnProperty("editGeometryDefault") &&
                this.config.editor.editGeometryDefault === true) {
                //perform any edit geom switch functionality
                //only when working with main layers feature and not on related features
                if (this._traversal.length < 2 && this._editGeomSwitch.domNode) {
                  this._editGeomSwitch.set('checked', true);
                  this._editGeomSwitch.check();
                }
              }
              if (this._traversal.length >= 1) {
                this._setWidgetFirstFocusNode("AI", true);
              }
              //Disable attachments editor for the layers which are not editable
              //add timeout as it is taking some time to load editor
              this.loading.show();
              setTimeout(lang.hitch(this, function () {
                if (this.attrInspector._attachmentEditor && (!this.currentLayerInfo.isEditable ||
                  !this.currentLayerInfo._editFlag)) {
                  this._disableAttachments(this.attrInspector._attachmentEditor, true, false);
                }
                this.loading.hide();
              }), 1000);
            }), 200);
            this.contentWrapper = prevContentWrapper;
            this.navButtonsDiv = prevPaginationWrapper;
            return;
          }
        }
        if (this._attrInspIsCurrentlyDisplayed && this._attrInspIsCurrentlyDisplayed === true) {
          if (this.attrInspector) {
            if (this.attrInspector._numFeatures === 0) {
              this._showTemplate(true);
              this._setWidgetFirstFocusNode("templatePicker", true);
            }
          }
        }
        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }
        this._removeLayerVisibleHandler();
      },

      //create instance of XYCoordinates
      _createCoordinatesPopup: function () {
        this._coordinates = new XYCoordinates({
          map: this.map,
          nls: this.nls,
          geometryService: this.geometryService
        });
        //Listen for event and get the updated location
        on(this._coordinates, "gotoSelectedLocation", lang.hitch(this, function (coordsData) {
          this._getUpdatedLocation(coordsData).then(lang.hitch(this,
            function (updatedLocation) {
              //Move graphics to updated location
              this.currentFeature.setGeometry(updatedLocation);
              this.map.centerAt(updatedLocation);
              this.geometryEdited();
            }), function () {
              //TODO : error handler
            });
        }));
      },

      _getUpdatedLocation: function (coordsData) {
        var newPoint, firstPoint, secondPoint, locationDef;
        locationDef = new Deferred();
        firstPoint = parseFloat(coordsData.firstPoint);
        secondPoint = parseFloat(coordsData.secondPoint);
        //Convert the coordinates as per coordinates system
        if (coordsData.coordinateSystem === "Map Spatial Reference") {
          newPoint = new Point(firstPoint, secondPoint,
            this.map.spatialReference);
          locationDef.resolve(newPoint);
        } else {
          newPoint = new Point(secondPoint, firstPoint, new SpatialReference(4326));
          coordinateUtils.getProjectedGeometry(newPoint, this.map.spatialReference,
            this.geometryService).then(
              lang.hitch(this, function (coordinatesInfo) {
                locationDef.resolve(coordinatesInfo);
              }), function () {
                //TODO : error handler
              });
        }
        return locationDef.promise;
      },

      _toggleAttrInspectorNavButtons: function () {
        var currentNavigationNode;
        if (query(".esriAttrPaginationDiv") && this._traversal) {
          currentNavigationNode = query(".esriAttrPaginationDiv")[this._traversal.length - 1];
        }
        //Do the action only of pagination node is found
        //No navigation node means the current panel is showing temp feature
        if (currentNavigationNode) {
          if (this.attrInspector && this.attrInspector._selection.length > 1) {
            domStyle.set(currentNavigationNode, "display", "block");
            if (currentNavigationNode.nextElementSibling) {
              domStyle.set(currentNavigationNode.nextElementSibling, "max-height", "calc(100% - 65px)");
              domStyle.set(currentNavigationNode.nextElementSibling, "margin-top", "5px");
            }
          } else {
            domStyle.set(currentNavigationNode, "display", "none");
            if (currentNavigationNode.nextElementSibling) {
              domStyle.set(currentNavigationNode.nextElementSibling, "max-height", "calc(100% - 40px)");
              domStyle.set(currentNavigationNode.nextElementSibling, "margin-top", "0px");
            }
          }
        }
      },
      startup: function () {
        this.inherited(arguments);
        // Update the drawing options by adding the label text from nls fetched
        // from this widget.
        this._updatedDrawingOptions();
        //create instance of geometryService
        if (this.appConfig.geometryService) {
          this.geometryService = new GeometryService(this.appConfig.geometryService);
        } else {
          Message({
            message: this.nls.geometryServiceURLNotFoundMSG
          });
          return;
        }
        if (this.appConfig.theme.name === "TabTheme") {
          //override the panel styles
          domClass.add(this.domNode.parentElement, "esriCTOverridePanelStyle");
        }
        this._createOverDef = new Deferred();
        //get selected theme color
        this._getSelectedThemeColor();
        //this.loaded_state = new this.widget_loaded({
        //  loaded: false
        //});
        if (this.config.editor.hasOwnProperty("displayPresetTop")) {
          if (this.config.editor.displayPresetTop === true) {
            dojo.place('presetFieldsTableDiv', 'templatePickerDiv', 'before');
          }
        }
        topic.subscribe("smartEditor/validate", lang.hitch(this, this._validateEventHandler));
        this._progressDiv = domConstruct.create("div", { "class": "processing-indicator-panel" });
        var parentDom = this.getParent().domNode.parentNode;
        parentDom.insertBefore(this._progressDiv, parentDom.firstChild);

        this.widgetActiveIndicator = domConstruct.create("div", { "class": "widgetActive widgetIndicator" });
        parentDom.insertBefore(this.widgetActiveIndicator, parentDom.firstChild);
        if (this.config.editor.editDescription === undefined || this.config.editor.editDescription === null ||
          this.config.editor.editDescription === "<br>") {
          this.config.editor.editDescription = '';
          this.templateTitle.innerHTML = this.config.editor.editDescription;
          domStyle.set(this.templateTitle, "display", "none");
          domAttr.set(this.templateTitle, "tabindex", "-1");
        }
        else {
          this.templateTitle.innerHTML = entities.decode(this.config.editor.editDescription);
          //set aria-label by using stripHTMl as description may contains html
          domAttr.set(this.templateTitle, "aria-label",
            utils.stripHTML(this.config.editor.editDescription));
          //dispaly the description and set the tabindex to 0
          domStyle.set(this.templateTitle, "display", "block");
          domAttr.set(this.templateTitle, "tabindex", "0");
        }

        this._orignls = esriBundle.widgets.attachmentEditor.NLS_attachments;
        //this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this.loading = new LoadingIndicator({
          hidden: true
        });
        this.loading.placeAt(this.domNode);

        this.attachmentloading = new LoadingIndicator({
          hidden: true
        });
        this.loading.placeAt(this.domNode);

        this.editToolbar = new Edit(this.map);
        this.drawToolbar = new Draw(this.map);

        this._createDrawingToolbar();

        // edit events
        this.own(on(this.editToolbar,
          "graphic-move-stop, rotate-stop, scale-stop, vertex-move-stop, vertex-click",
          lang.hitch(this, this.geometryEdited)));

        // draw event
        //updated to draw-complete as draw-end is depricated
        this.own(on(this.drawToolbar, "draw-complete", lang.hitch(this, function (evt) {
          //added fix - if polygon is drawn with only two vertices
          //in such case dont do anything let the tool be active and let user draw valid polygon
          if (evt.geometry && evt.geometry.rings && evt.geometry.rings.length === 1 &&
            evt.geometry.rings[0].length < 4) {
            return;
          }
          this.drawToolbar.deactivate();
          this._addGraphicToLocalLayer(evt);
        })));


        this.privilegeUtil = PrivilegeUtil.getInstance();
        //<div class="processing-indicator-panel"></div>
        this._setTheme();
        this.shelter.show();
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (operLayerInfos) {

            var timeoutValue;
            if (this.appConfig.theme.name === "BoxTheme") {
              timeoutValue = 1050;

            } else {
              timeoutValue = 1;
            }
            setTimeout(lang.hitch(this, function () {
              //Function below was to load level 1 user and disable the widget, but since level 1 should be able to edit
              //public services, all paths initialize the control
              this.privilegeUtil.loadPrivileges(this._getPortalUrl()).then(lang.hitch(this, function (status) {
                var valid = true;
                this._user = null;
                if (!status) {
                  valid = this._initControl(operLayerInfos);
                } else {
                  var userInfo = this.privilegeUtil.getUser();
                  if (userInfo) {
                    this._user = userInfo.username;
                  }

                  if (this.privilegeUtil.userRole.canEditFeatures() === true) {
                    valid = this._initControl(operLayerInfos);

                  }
                  else if (this.privilegeUtil.userRole.canEditFeaturesFullControl === true) {
                    valid = this._initControl(operLayerInfos);

                  }
                  else {
                    valid = this._initControl(operLayerInfos);
                    //this._noPrivilegeHandler(window.jimuNls.noEditPrivileges);//this.nls.noEditPrivileges);
                  }
                }
                if (valid === false) {
                  this._noPrivilegeHandler(window.jimuNls.invalidConfiguration);//this.nls.invalidConfiguration);
                }

                this.shelter.hide();

              }), lang.hitch(this, function () {
                this._initControl(operLayerInfos);
                //this._noPrivilegeHandler(window.jimuNls.noEditPrivileges);//this.nls.noEditPrivileges);
              }));
              this.shelter.hide();
              this._workBeforeCreate();

            }), timeoutValue);
          }));
      },

      /**
       * This function is used to perform further execution once editing of geometry like
       * moving geometry is completed
       */
      geometryEdited: function () {
        //this._updateRefreshButtonState();
        if (this._refreshButton && this.config.editor.enableAttributeUpdates) {
          //if automatic update is configured to true show refresh button
          if (this.config.editor.enableAutomaticAttributeUpdates) {
            domClass.remove(this._refreshButton, "hidden");
            //if automatic update is 'ON' in the widget then call refresh attribute function
            if (domClass.contains(this._refreshButton, "esriCTAutoUpdateOnMode")) {
              this._refreshAttributes();
            }
          }
        }
        this.geometryChanged = true;
        this._enableAttrInspectorSaveButton(this._validateAttributes());
      },

      _noPrivilegeHandler: function (message) {
        this.templateTitle.innerHTML = message;
        //set aria-label by using stripHTMl as description may contains html
        domAttr.set(this.templateTitle, "aria-label", message);
        //dispaly the description and set the tabindex to 0
        domStyle.set(this.templateTitle, "display", "block");
        domAttr.set(this.templateTitle, "tabindex", "0");
        if (this.templatePicker) {
          dojo.style(this.templatePicker.domNode, "display", "none");
          if (this._mapClick) {

            this._mapClick.remove();
            this._mapClick = null;
          }
        }
        if (this.drawingTool) {
          dojo.style(this.drawingTool.domNode, "display", "none");
        }
        if (this.presetFieldsTableDiv) {
          dojo.style(this.presetFieldsTableDiv, "display", "none");
        }
        utils.initFirstFocusNode(this.domNode, this.templateTitle);
        utils.initLastFocusNode(this.domNode, this.templateTitle);
        utils.focusFirstFocusNode(this.domNode);
        this.map.setInfoWindowOnClick(true);
        this.shelter.hide();
      },
      _getPortalUrl: function (url) {
        if (url) {
          return portalUrlUtils.getStandardPortalUrl(url);
        } else {
          return portalUrlUtils.getStandardPortalUrl(this.appConfig.portalUrl);
        }
      },
      feature_action_select: function (features, featureLayer) {
        // features probably is empty.
        if (!featureLayer) {
          return;
        }
        if (!features) {
          return;
        }
        if (features.length === 0) {
          return;
        }
        if (this.state !== 'active') {
          this.widgetManager.activateWidget(this);
        }
        var firstFeature = features[0];
        if (this._validateFeatureChanged() && this.currentFeature) {
          // do not show templatePicker after saving
          if (this.config.editor.displayPromptOnSave && this.config.editor.displayPromptOnSave === true) {
            this._promptToResolvePendingEdit(false, { featureLayer: featureLayer, feature: firstFeature }, false, true);
          } else {
            this.load_from_featureaction(featureLayer, firstFeature);
          }
        } else {
          this.load_from_featureaction(featureLayer, firstFeature);
        }
      },
      load_from_featureaction: function (featureLayer, firstFeature) {
        //CT- Commented as now we need to clear multiple layer from multiple AI
        /* if (this.updateFeatures) {
           var layersRefresh = [];
           array.forEach(this.updateFeatures, lang.hitch(this, function (feature) {
             var layer = feature.getLayer();
             if (layersRefresh && layersRefresh.indexOf(layer.id) === -1) {
               layersRefresh.push(layer.id);
               layer.clearSelection();
               layer.refresh();
             }
           }));
         }*/
        this._clearLayerSelection();
        if (this.contentWrapper && this.contentWrapper.parentNode &&
          !domClass.contains(this.contentWrapper, "hidden")) {
          this.contentWrapper.parentNode.removeChild(this.contentWrapper);
          //Remove all the previously created pagination dom's before creating new AI
          query(".esriAttrPaginationDiv", this.domNode).forEach(
            lang.hitch(this, function (paginationDom) {
              domConstruct.destroy(paginationDom);
            }));
        }
        //reset array
        this._traversal = [];
        this._nodesCollection = [];
        this._paginationNodeCollection = [];
        this._buttonsWrapper = [];
        this._attributeInspectorCollection = [];
        this._relatedTablesInfo = {};
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;

        this.map.infoWindow.hide();
        if (this.viewedLayerDetails.length > 0) {
          this.loading.show();
          featureLayer = this._getLayerInfoByID(this.viewedLayerDetails.shift());
          firstFeature = this.viewedFeatureDetails.shift();
          this._traverseToSelectedFeature(featureLayer, firstFeature);
        }
      },

      _clearLayerSelection: function () {
        if (this._attributeInspectorCollection && this._attributeInspectorCollection.length > 0) {
          array.forEach(this._attributeInspectorCollection, function (attrInspector) {
            //clear previous selections of layer
            if (attrInspector) {
              //as now prev attribute inspector could have multiple features of multiple layer
              //clear selections of all layers in layer infos
              if (attrInspector.layerInfos) {
                array.forEach(attrInspector.layerInfos, function (layerInfo) {
                  var layer = layerInfo.featureLayer;
                  layer.clearSelection();
                  layer.refresh();
                });
              }
              attrInspector.destroy();
            }
          });
        }
        //clear previous selections of layer
        if (this.attrInspector) {
          //as now prev attribute inspector could have multiple features of multiple layer
          //clear selections of all layers in layer infos
          if (this.attrInspector.layerInfos) {
            array.forEach(this.attrInspector.layerInfos, function (layerInfo) {
              var layer = layerInfo.featureLayer;
              layer.clearSelection();
              layer.refresh();
            });
          }
          this.attrInspector.destroy();
        }
      },
      _traverseToSelectedFeature: function (featureLayer, feature) {
        var def = new Deferred();
        var tempFeature;
        if (this.viewedFeatureDetails.length > 0) {
          tempFeature = this.viewedFeatureDetails[0];
          if (this.viewedLayerDetails[0] === this.viewedLayerDetails[1]) {
            tempFeature = this.viewedFeatureDetails[1];
          }
        }

        this._createAttributeInspector([featureLayer], false, null, def, tempFeature);
        if (feature) {
          SelectionManager.getInstance().setSelection(featureLayer.featureLayer, feature).then(
            lang.hitch(this, function () {
              var selectedFeatures = featureLayer.featureLayer.getSelectedFeatures();
              this.updateFeatures = selectedFeatures;
              if (this.updateFeatures.length > 0) {
                this._showTemplate(false);
              }
            }));
        }
        def.then(lang.hitch(this, function () {
          if (this.viewedLayerDetails.length > 0) {
            var relatedFeatureLayerId = this.viewedLayerDetails.shift();
            this.viewedFeatureDetails.shift();
            if (this.viewedLayerDetails.length > 0 && this.viewedLayerDetails[0] === relatedFeatureLayerId) {
              this.viewedLayerDetails.shift();
              this.viewedFeatureDetails.shift();
            }
            var tableTitle = query("[layerid='" + relatedFeatureLayerId + "']", this.contentWrapper)[0];
            //Check for table title container before calling click
            if (tableTitle) {
              tableTitle.click();
            }
          }
          if (this.viewedLayerDetails.length === 0) {
            this.loading.hide();
          }
        }));
      },

      _getFeatureIndexToSelect: function (relatedFeature) {
        var featureOID, featureIndex = -1;
        featureOID = relatedFeature.attributes[relatedFeature._layer.objectIdField];
        array.some(this.attrInspector._selection, lang.hitch(this, function (feature, index) {
          if (feature.attributes[feature._layer.objectIdField] === featureOID) {
            featureIndex = index;
            return true;
          }
        }));
        return featureIndex;
      },
      //Function from the feature action
      beginEditingByFeatures: function (features, featureLayer, viewedLayerDetails, viewedFeatureDetails) {
        //when opening selected features in Smart Editor widget
        //if the copy features screen is open it needs to be cleared
        if (this._copyFeaturesObj) {
          //set currentDrawtype to null as in case if copy features we set it to 'SELECT'
          //and it shows console error if we dont set drawType to null
          this.currentDrawType = null;
          this._copyFeaturesObj.cancelBtnClicked();
        }
        //clear the temporary graphics if present
        if (this.cacheLayer) {
          this.cacheLayer.clear();
        }
        this.viewedLayerDetails = viewedLayerDetails;
        this.viewedFeatureDetails = viewedFeatureDetails;
        if (!featureLayer) {
          return;
        }
        if (!features) {
          return;
        }
        if (features.length === 0) {
          return;
        }
        this._createOverDef.then(lang.hitch(this, function () {
          this.feature_action_select(features, featureLayer);

        }));
        //if (this.loaded_state.get('loaded') === true) {
        //  this.feature_action_select(features, featureLayer);
        //}
        //else {
        //  this.loaded_state.watch("loaded", lang.hitch(this,function(name, oldValue, value){
        //    if (name === 'loaded' && value === true && oldValue === false) {
        //      this.feature_action_select(features, featureLayer);
        //    }
        //  }));
        //}

      },



      onReceiveData: function (name, widgetId, data, historyData) {
        if (this.config.editor) {
          historyData = historyData;
          widgetId = widgetId;
          if (this.config.editor.hasOwnProperty("listenToGF")) {
            if (this.config.editor.listenToGF !== true) {
              return;
            }
          } else {
            return;
          }
          if (name !== 'GroupFilter') {
            return;
          }

          if (data.message.hasOwnProperty("fields") &&
            data.message.hasOwnProperty("values")) {
            //if groupName is available set preset values using it
            //else for backward compatibility using field name set values for preset groups
            if (data.message.hasOwnProperty("groupName")) {
              this._setPresetValueValue(null, data.message.values[0], data.message.groupName);
            } else {
              array.forEach(data.message.fields, function (field) {
                this._setPresetValueValue(field, data.message.values[0], null);
              }, this);
            }
          }
        }
      },
      /*jshint unused:true */
      _setTheme: function () {
        //if (this.appConfig.theme.name === "BoxTheme" ||
        //    this.appConfig.theme.name === "DartTheme" ||
        //    this.appConfig.theme.name === "LaunchpadTheme") {
        var styleLink;
        if (this.appConfig.theme.name === "DartTheme") {
          utils.loadStyleLink('dartOverrideCSS', this.folderUrl + "/css/dartTheme.css", null);
        }
        else {
          styleLink = document.getElementById("dartOverrideCSS");
          if (styleLink) {
            styleLink.disabled = true;
          }
        }
        if (this.appConfig.theme.name === "LaunchpadTheme") {
          utils.loadStyleLink('launchpadOverrideCSS', this.folderUrl + "/css/launchpadTheme.css", null);
        }
        else {
          styleLink = document.getElementById("launchpadOverrideCSS");
          if (styleLink) {
            styleLink.disabled = true;
          }
        }
        if (this.appConfig.theme.name === "DashboardTheme") {
          utils.loadStyleLink('dashboardOverrideCSS', this.folderUrl + "/css/dashboardTheme.css", null);
        }
        else {
          styleLink = document.getElementById("dashboardOverrideCSS");
          if (styleLink) {
            styleLink.disabled = true;
          }
        }
      },
      _mapClickHandler: function (create) {
        if (create === true && this._attrInspIsCurrentlyDisplayed === false) {
          this.map.setInfoWindowOnClick(false);
          if (this._mapClick === undefined || this._mapClick === null) {
            this._mapClick = on(this.map, "click", lang.hitch(this, this._onMapClick));
          }
          //this._activateTemplateToolbar();
        }
        else if (create === true && this._attrInspIsCurrentlyDisplayed === true) {
          if (this._mapClick) {
            this._mapClick.remove();
            this._mapClick = null;
          }
          this.map.setInfoWindowOnClick(true);
          //this._validateAttributes();
        }
        else {
          if (this._mapClick) {

            this._mapClick.remove();
            this._mapClick = null;
          }
          this.map.setInfoWindowOnClick(true);
          if (this.drawToolbar) {
            //this._lastDrawnShape = lang.clone(this.drawToolbar._points);
            this.drawToolbar.deactivate();
          }
        }
      },
      destroy: function () {
        this.inherited(arguments);

        if (this.attrInspector) {
          this.attrInspector.destroy();
        }
        this.attrInspector = null;

        if (this.templatePicker) {
          this.templatePicker.destroy();
        }
        this.templatePicker = null;
        if (this.currentDrawType) {
          this.currentDrawType = null;
        }
        if (this._menus !== null && this._menus !== undefined) {
          for (var property in SEDrawingOptions) {
            if (this._menus.hasOwnProperty(property)) {
              if (this._menus[property] !== null && this._menus[property] !== undefined) {
                this._menus[property].destroyRecursive(false);
              }
            }
          }
          this._menus = {};
        }
        if (this.drawingTool !== null && this.drawingTool !== undefined) {
          this.drawingTool.destroyRecursive(false);
          this.drawingTool = null;
        }
        this._enableFeatureReduction();
        this.inherited(arguments);
      },
      onActive: function () {
        if (this._userHasPrivilege === true) {
          if (domClass.contains(this.widgetActiveIndicator, "widgetNotActive")) {
            domClass.remove(this.widgetActiveIndicator, "widgetNotActive");
          }
          domClass.add(this.widgetActiveIndicator, "widgetActive");
          if (this.map) {
            this._disableFeatureReduction();
            if (this.templatePicker) {
              this.templatePicker.update();
            }
            this._mapClickHandler(true);
            //Remove selection clear handlers for all the layers so that,
            //it will work only for layer selection clear from outside the widget
            this._disconnectLayerSelectionClearedOutside();

            if (this._attrInspIsCurrentlyDisplayed === false) {
              var override = null;
              if (this.drawingTool && this.currentDrawType) {
                override = this.currentDrawType;
              }
              this._activateTemplateToolbar(override);
            }
          }
        }
      },
      _enableFeatureReduction: function () {
        if (this.clusterState === false) {
          array.forEach(this.featureReductionEnabledLayers, function (layer) {
            if (!layer.isFeatureReductionEnabled()) {
              layer.enableFeatureReduction();
            }
          });
          array.forEach(this.rendererDifferentLayers, function (layer) {
            if (layer._layerRenderer) {
              layer.setRenderer(layer._layerRenderer);
              layer.redraw();
            }
          });
          this.clusterState = true;
        }
      },
      _disableFeatureReduction: function () {
        if (this.clusterState === true) {
          array.forEach(this.featureReductionEnabledLayers, function (layer) {
            if (layer.isFeatureReductionEnabled()) {
              layer.disableFeatureReduction();
            }
          });
          array.forEach(this.rendererDifferentLayers, function (layer) {
            if (layer._serviceRendererJson) {
              layer.setRenderer(rendererJsonUtils.fromJson(layer._serviceRendererJson));
              layer.redraw();
            }
          });
          this.clusterState = false;
        }
      },

      _handleLayerSelectionClear: function (attrInspector) {
        if (attrInspector && attrInspector.layerInfos) {
          array.forEach(attrInspector.layerInfos, lang.hitch(this, function (layerInfo) {
            if (layerInfo.featureLayer) {
              var layerHandle = on(layerInfo.featureLayer, 'selection-clear',
                lang.hitch(this, this._onLayerSelectionCleared));
              this.own(layerHandle);
              this._layerClearSelectionHandles.push(layerHandle);
            }
          }));
        }
      },

      //Added this function  mulitple layers cleard from out side the widget
      //should not fire the _layerChangeOutside multiple times
      _onLayerSelectionCleared: function () {
        if (this._LayerSelectionClearedTimer) {
          clearTimeout(this._LayerSelectionClearedTimer);
        }
        this._LayerSelectionClearedTimer = setTimeout(lang.hitch(this, function () {
          if (!this._layerChangedOutside) {
            this._layerChangedOutside = true;
            //show template picker and clear current AI
            this._navigateToMain();
          }
        }), 100);
      },

      _navigateToMain: function () {
        this._attrInspIsCurrentlyDisplayed = false;
        //this._mapClickHandler(true);
        this._showTemplatePicker();
        //reset array
        this._traversal = [];
        this._nodesCollection = [];
        this._paginationNodeCollection = [];
        this._buttonsWrapper = [];
        this._attributeInspectorCollection = [];
        this._relatedTablesInfo = {};
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
      },

      _connectLayerSelectionClearedOutside: function () {
        this._layerChangedOutside = false;
        this._disconnectLayerSelectionClearedOutside();
        if (this._attrInspIsCurrentlyDisplayed) {
          //handle layer selection clear for all the layers of all the atribute inspector else
          //only for the current attribute inspector
          if (this._attributeInspectorCollection && this._attributeInspectorCollection.length > 0) {
            array.forEach(this._attributeInspectorCollection, lang.hitch(this, function (attrInspector) {
              if (attrInspector) {
                this._handleLayerSelectionClear(attrInspector);
              }
            }));
          }
          if (this.attrInspector) {
            this._handleLayerSelectionClear(this.attrInspector);
          }
        }
      },

      _disconnectLayerSelectionClearedOutside: function () {
        if (this._layerClearSelectionHandles && this._layerClearSelectionHandles.length > 0) {
          array.forEach(this._layerClearSelectionHandles, lang.hitch(this, function (layerHandle) {
            layerHandle.remove();
          }));
        }
        this._layerClearSelectionHandles = [];
      },

      onDeActive: function () {
        if (domClass.contains(this.widgetActiveIndicator, "widgetActive")) {
          domClass.remove(this.widgetActiveIndicator, "widgetActive");
        }
        domClass.add(this.widgetActiveIndicator, "widgetNotActive");
        if (this.map) {
          this._mapClickHandler(false);
        }
        this._enableFeatureReduction();
        //Connect layers selection clear event for all the layer of all attributeInspectors
        this._connectLayerSelectionClearedOutside();
      },

      onOpen: function () {
        //MJM - toggle Summary button off to allow editing of raw web map data
        if (document.getElementById("dijit__WidgetBase_1").className.search("jimu-state-selected") != -1) {
          document.getElementById("dijit__WidgetBase_1").click();  //simulate button click - summary button currently selected, turn off - this.appConfig.widgetOnScreen.widgets[5]
        }

        if (this._userHasPrivilege === true) {
          //this.fetchDataByName('GroupFilter');
          this._workBeforeCreate();
          this.widgetManager.activateWidget(this);
        }
        if (this.templatePicker) {
          var templatePickerInstance;
          this.templatePicker.update();
          templatePickerInstance = query(".esriTemplatePicker", this.domNode);
          //Check display property of template picker and accordingly handle the preset dialog
          //display
          if (templatePickerInstance && templatePickerInstance[0]) {
            if (domStyle.get(templatePickerInstance[0], "display") === "none") {
              query(".presetFieldsTableDiv")[0].style.display = "none";
            } else {
              //Turn on the preset section only if preset is configured
              if (this.config.hasOwnProperty("attributeActionGroups") &&
                Object.keys(this.config.attributeActionGroups.Preset).length > 0) {
                query(".presetFieldsTableDiv")[0].style.display = "block";
              }
            }
            //Update the first and last focus node once the contents are shown/hidden
            this._setWidgetFirstFocusNode("templatePicker", true);
          }
        }
      },

      _getTableInfos: function () {
        var defs = [];
        var tableInfoArray = this._jimuLayerInfos.getTableInfoArray();
        array.forEach(tableInfoArray, function (jimuTableInfo) {
          defs.push(jimuTableInfo.getLayerObject());
        }, this);
        return all(defs);
      },

      _initControl: function (operLayerInfos) {
        this._userHasPrivilege = true;
        this._jimuLayerInfos = operLayerInfos;
        //Get table infos so that all the tables layer objects are loaded
        //This will help in getting the capabilities and other layer infos
        this._getTableInfos();
        //create address utils and intersectionUtils object to copy values
        this.addressUtils = new AddressUtils({
          "config": this.config
        });
        this._intersectionUtils = new Intersection({
          _jimuLayerInfos: this._jimuLayerInfos,
          map: this.map,
          "defaultToleranceSettings": this.config.editor.defaultToleranceSettings
        });
        var onlyConfiged = false;
        if (this.config.editor && this.config.editor.layerInfos) {
          onlyConfiged = this.config.editor.layerInfos.length > 0;
        }
        this.config.editor.configInfos = editUtils.getConfigInfos(this._jimuLayerInfos,
          this.config.editor.layerInfos, false, onlyConfiged);
        if (onlyConfiged === false) {
          array.forEach(this.config.editor.configInfos, function (configInfo) {
            configInfo._editFlag = true;
          });
        }
        if (this.config.editor.configInfos === undefined || this.config.editor.configInfos === null) {
          return false;
        }
        else if (this.config.editor.configInfos.length === 0) {
          return false;
        }
        this._processConfig();
        array.forEach(this.config.editor.configInfos, function (configInfo) {
          configInfo.featureLayer.name = configInfo.layerInfo.title;
          var layer = configInfo.featureLayer;
          var layerRenderer = layer.renderer;
          var layerRendererJson = layerRenderer.toJson();
          var serviceDefJson = JSON.parse(layer._json);
          //Added to handled csv layers where the __json is in a layerDefinition
          if (serviceDefJson.hasOwnProperty("layerDefinition")) {
            serviceDefJson = serviceDefJson.layerDefinition
          }
          var serviceRendererJson = null;
          if (serviceDefJson.hasOwnProperty("drawingInfo")) {
            if (serviceDefJson.drawingInfo.hasOwnProperty("renderer")) {
              serviceRendererJson = serviceDefJson.drawingInfo.renderer;
            }
          }
          layer._layerRenderer = layerRenderer;
          layer._serviceRendererJson = serviceRendererJson;
          if (layer.hasFeatureReduction && layer.hasFeatureReduction()) {
            this.featureReductionEnabledLayers.push(layer);
          } else if (layerRendererJson.hasOwnProperty('type') && layerRendererJson.type == "heatmap") {
            this.rendererDifferentLayers.push(layer);
          }
        }, this);
        this._disableFeatureReduction();
        if (this.config.editor.hasOwnProperty("autoSaveEdits")) {
          if (this.config.editor.autoSaveEdits) {
            this._autoSaveRuntime = this.config.editor.autoSaveEdits;
            if (this._autoSaveRuntime) {
              registry.byId("autoSaveSwitch").set('checked', true);
            } else {
              registry.byId("autoSaveSwitch").set('checked', false);
            }
          }
        }
        else {
          this.config.editor.autoSaveEdits = false;
        }
        //array.forEach(this.featureReductionEnabledLayers, function (layer) {
        //  layer.disableFeatureReduction();
        //});
        this._createEditor();
        this.fetchDataByName('GroupFilter');
        this.widgetManager.activateWidget(this);
        this._createOverDef.resolve();
        this._setWidgetFirstFocusNode("templatePicker", true);
        //this.loaded_state.set("loaded", true);
        return true;
      },
      _addFilterEditor: function (layers) {
        if (this.config.editor.useFilterEditor === true && this.templatePicker) {
          if (this._filterEditor) {
            this._filterEditor.setTemplatePicker(this.templatePicker, layers);
          }
          else {
            this._filterEditorNode = domConstruct.create("div", {});
            this.templatePickerDiv.insertBefore(this._filterEditorNode,
              this.templatePicker.domNode);
            this._filterEditor = new SEFilterEditor({
              _templatePicker: this.templatePicker,
              _layers: layers,
              map: this.map,
              nls: this.nls
            }, this._filterEditorNode);
          }
        }
      },
      _activateEditToolbar: function (feature) {
        var layer = feature.getLayer();
        if (this.editToolbar.getCurrentState().tool !== 0) {
          this.editToolbar.deactivate();
        }
        switch (layer.geometryType) {
          case "esriGeometryPoint":
            this.editToolbar.activate(Edit.MOVE, feature);
            break;
          case "esriGeometryPolyline":
          case "esriGeometryPolygon":
            /*jslint bitwise: true*/
            this.editToolbar.activate(Edit.EDIT_VERTICES |
              Edit.MOVE |
              Edit.ROTATE |
              Edit.SCALE, feature);
            /*jslint bitwise: false*/
            break;
        }
      },
      _polygonToPolyline: function (polygon) {
        var polyline = new Polyline();
        array.forEach(polygon.rings, function (ring) {
          polyline.addPath(ring);
          //array.forEach(ring, function (part) {
          //  polyline.addPath(part);
          //});
        });
        polyline.spatialReference = polygon.spatialReference;
        return polyline;
      },
      _addRelatedFeatureToLocalLayer: function (graphic, fKeyField) {
        var newTempLayerInfos;
        var localLayerInfo = null;
        if (this.attrInspector &&
          this.attrInspector._attachmentUploader && this.attrInspector._attachmentUploader !== null) {
          this.attrInspector._attachmentUploader.clear();
        }
        this._removeLocalLayers();
        this.cacheLayer = this._cloneLayer(graphic.featureLayer.layerObject);
        var cacheLayerHandler = on(this.cacheLayer, "load", lang.hitch(this, function () {
          cacheLayerHandler.remove();
          /* TODO: CT - Not required as we will not be allowing to add geometry for related features
          if (this.cacheLayer.geometryType) {
            this.cacheLayer.setSelectionSymbol(this._getSelectionSymbol(this.cacheLayer.geometryType, true));
          }
          */
          localLayerInfo = this._getLayerInfoForLocalLayer(this.cacheLayer);
          newTempLayerInfos = [localLayerInfo];//this._converConfiguredLayerInfos([localLayerInfo]);
          this._createAttributeInspector([localLayerInfo], true, graphic.featureLayer.layerObject,
            null, null, fKeyField);
          var newAttributes = lang.clone(graphic.attributes);
          if (this._usePresetValues) {
            this._modifyAttributesWithPresetValues(newAttributes, newTempLayerInfos[0], null, fKeyField);
          }
          var newGraphic = new Graphic(null, null, newAttributes);
          newGraphic.preEditAttrs = JSON.parse(JSON.stringify(newGraphic.attributes));
          this.cacheLayer.applyEdits([newGraphic], null, null, lang.hitch(this, function (e) {
            var queryTask = new Query();
            queryTask.objectIds = [e[0].objectId];
            this.cacheLayer.selectFeatures(queryTask, FeatureLayer.SELECTION_NEW, lang.hitch(this, function () {
              this.currentFeature = this.updateFeatures[0] = newGraphic;
              this.getConfigDefaults();
              this.geometryChanged = false;
              if (this._attributeInspectorTools) {
                this._attributeInspectorTools.triggerFormValidation();
              }
              var graphicOrigLyr = (this.currentFeature).getLayer();
              this.currentLayerInfo = this._getLayerInfoByID(graphicOrigLyr.id);
              this.currentLayerInfo.isCache = true;
              this._toggleDeleteButton(false);
              this._enableAttrInspectorSaveButton(this._validateAttributes(), true);
              this._toggleAttrInspectorNavButtons();
            }));
          }));
          this._showTemplate(false, false);
          if (this.config.editor.hasOwnProperty("autoSaveEdits") && this._autoSaveRuntime === true) {
            setTimeout(lang.hitch(this, function () {
              var saveBtn = query(".saveButton", this.buttonHeader)[0];
              if (!saveBtn) {
              } else {
                on.emit(saveBtn, 'click', { cancelable: true, bubbles: true });
              }
            }), 100);
          }
        }));
      },

      _getCopyAttributes: function (layerInfo, geometry) {
        var defList = [], copyAttributesInfo = {}, coordinatesDef, resultDef;
        resultDef = new Deferred();
        coordinatesDef = new Deferred();
        //Get data required for intersection
        defList.push(this._intersectionUtils.getDistinctLayers(layerInfo, geometry));
        //Get coordinates info and on completing coordinates info get address info
        defList.push(coordinatesDef);
        coordinateUtils.getCoordinatesData(geometry, this.geometryService).then(
          lang.hitch(this, function (coordinatesInfo) {
            copyAttributesInfo.Coordinates = coordinatesInfo;
            this.addressUtils.locateAddress(coordinatesInfo.MapSpatialReference).then(
              function (addressInfo) {
                //once both coordinate and address infos are available resolve coordinatesDef
                copyAttributesInfo.Address = addressInfo;
                coordinatesDef.resolve(copyAttributesInfo);
              });
          }));
        //Once all info for Intersection, Coordinates and Address are available
        //resolve main result def with copyAttributesInfo object
        all(defList).then(lang.hitch(this, function (allResult) {
          copyAttributesInfo.Intersection = allResult[0];
          resultDef.resolve(copyAttributesInfo);
        }));
        return resultDef.promise;
      },

      // this function also create a new attribute inspector for the local layer
      _addGraphicToLocalLayer: function (evt, copiedAttributes) {
        if (this.templatePicker === undefined ||
          this.templatePicker === null) { return; }
        if (!this.templatePicker.getSelected()) { return; }
        var selectedTemp = this.templatePicker.getSelected();
        var newTempLayerInfos;
        var localLayerInfo = null;

        if (this.attrInspector) {
          if (this.attrInspector._attachmentUploader && this.attrInspector._attachmentUploader !== null) {
            this.attrInspector._attachmentUploader.clear();
          }
          this.attrInspector.destroy();
          this.attrInspector = null;
        }

        this._removeLocalLayers();
        // preparation for a new attributeInspector for the local layer

        this.cacheLayer = this._cloneLayer(this.templatePicker.getSelected().featureLayer);
        var cacheLayerHandler = on(this.cacheLayer, "load", lang.hitch(this, function () {
          cacheLayerHandler.remove();

          this.cacheLayer.setSelectionSymbol(this._getSelectionSymbol(this.cacheLayer.geometryType, true));

          localLayerInfo = this._getLayerInfoForLocalLayer(this.cacheLayer);
          newTempLayerInfos = [localLayerInfo];//this._converConfiguredLayerInfos([localLayerInfo]);

          this._createAttributeInspector([localLayerInfo], true, this.templatePicker.getSelected().featureLayer);

          if (this.config.editor.hasOwnProperty("editGeometryDefault") &&
            this.config.editor.editGeometryDefault === true) {
            //perform any edit geom switch functionality
            //only when working with main layers feature and not on related features
            setTimeout(lang.hitch(this, function () {
              if (this._traversal.length < 2) {
                this._editGeomSwitch.set('checked', true);
                this._editGeomSwitch.check();
              }
            }), 100);
          }

          var newAttributes = lang.clone(selectedTemp.template.prototype.attributes);

          if (this.cacheLayer.geometryType === "esriGeometryPolyline" && evt.geometry.type === 'polygon') {
            evt.geometry = this._polygonToPolyline(evt.geometry);
          }
          this.loading.show();
          //load all the info required to copy attributes
          this._getCopyAttributes(localLayerInfo, evt.geometry).then(lang.hitch(this, function (copyAttributesInfo) {
            //if copying features and have the copied attributes, then use them
            if (copiedAttributes) {
              var selectedFeaturesAttributes = lang.clone(copiedAttributes);
              //copy only those attributes which are not available in template or
              //if the value in template for those attribute is null or
              //override defaults by copied feature is true
              for (var attrKey in selectedFeaturesAttributes) {
                if (!newAttributes.hasOwnProperty(attrKey) || newAttributes[attrKey] === null ||
                  this.config.editor.overrideDefaultsByCopiedFeature) {
                  newAttributes[attrKey] = selectedFeaturesAttributes[attrKey];
                }
              }
            }
            this._modifyAttributesWithPresetValues(newAttributes, newTempLayerInfos[0], copyAttributesInfo);
            this.loading.hide();
            //perform feature creation
            var newGraphic = new Graphic(evt.geometry, null, newAttributes);
            // store original attrs for later use
            newGraphic.preEditAttrs = JSON.parse(JSON.stringify(newGraphic.attributes));
            this.cacheLayer.applyEdits([newGraphic], null, null, lang.hitch(this, function (e) {
              var queryTask = new Query();
              queryTask.objectIds = [e[0].objectId];
              this.cacheLayer.selectFeatures(queryTask, FeatureLayer.SELECTION_NEW, lang.hitch(this, function () {
                this.currentFeature = this.updateFeatures[0] = newGraphic;
                this.getConfigDefaults();
                this.geometryChanged = false;
                //this._editGeomSwitch.set('checked', true);
                if (this._attributeInspectorTools) {
                  this._attributeInspectorTools.triggerFormValidation();
                }
                //this._attachLayerHandler();
                var graphicOrigLyr = (this.currentFeature).getLayer();
                this.currentLayerInfo = this._getLayerInfoByID(graphicOrigLyr.id);
                this.currentLayerInfo.isCache = true;
                //this._attachLayerHandler();
                this._toggleDeleteButton(false);
                //this._toggleEditGeoSwitch(false);

                //this._createSmartAttributes();
                //
                this._enableAttrInspectorSaveButton(this._validateAttributes());
                var paginationNode = query(".esriAttrPaginationDiv", this.domNode);
                //Hide attribute inspector's navigation button
                if (paginationNode && paginationNode[0]) {
                  domStyle.set(paginationNode[0], "display", "none");
                }
              }));
            }));


            this._showTemplate(false, false);

            if (this.config.editor.hasOwnProperty("autoSaveEdits") && this._autoSaveRuntime === true) {
              setTimeout(lang.hitch(this, function () {
                var saveBtn = query(".saveButton", this.buttonHeader)[0];
                if (!saveBtn) {
                  //do nothing
                } else {
                  on.emit(saveBtn, 'click', { cancelable: true, bubbles: true });
                }
              }), 100);
            }
          }));
        }));
      },

      // cancel editing of the current feature
      _cancelEditingFeature: function (showTemplatePicker) {
        if (!this.currentFeature) { return; }

        if (showTemplatePicker) {

          this._showTemplate(true, false);
        } else { // show attr inspector

          // restore attributes & geometry
          if (this.currentFeature.preEditAttrs) {
            this.currentFeature.attributes = JSON.parse(JSON.stringify(this.currentFeature.preEditAttrs));
          }
          if (this.currentFeature.origGeom) {
            this.currentFeature.geometry = geometryJsonUtil.fromJson(this.currentFeature.origGeom);
          }
          this.currentFeature.getLayer().refresh();
          this.attrInspector.refresh();

          //reset
          this._resetEditingVariables();

        }
      },

      _addDateFormat: function (fieldInfo) {
        if (fieldInfo && fieldInfo.format && fieldInfo.format !==
          null) {
          if (fieldInfo.format.dateFormat && fieldInfo.format.dateFormat !==
            null) {
            if (fieldInfo.format.dateFormat.toString().toUpperCase().indexOf("TIME") >= 0) {
              fieldInfo.format.time = true;
            }
            //if (fieldInfo.format.dateFormat ===
            //  "shortDateShortTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLongTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateShortTime24" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLEShortTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLEShortTime24" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLELongTime" ||
            //  fieldInfo.format.dateFormat ===
            //  "shortDateLELongTime24") {
            //  fieldInfo.format.time = true;
            //}
          }
        }
      },

      _processLayerFields: function (fields) {
        //Function required to add the Range details to a range domain so the layer can be cloned

        array.forEach(fields, function (field) {
          if (field.domain !== undefined && field.domain !== null) {
            if (field.domain.type !== undefined && field.domain.type !== null) {
              if (field.domain.type === 'range') {
                if (field.domain.hasOwnProperty('range') === false) {
                  field.domain.range = [field.domain.minValue, field.domain.maxValue];
                }
              }
            }

          }
        });

        return fields;
      },
      _iterateCollection: function (collection) {
        return function (f) {
          for (var i = 0; collection[i]; i++) {
            f(collection[i], i);
          }
        };
      },
      _cloneLayer: function (layer) {
        var cloneFeaturelayer;
        var fieldsproc = this._processLayerFields(layer.fields);
        var featureCollection = {
          layerDefinition: {
            "id": 0,
            "name": layer.name + this.nls.editorCache,
            "type": "Feature Layer",
            "displayField": layer.displayField,
            "description": "",
            "copyrightText": "",
            "relationships": [],
            "geometryType": layer.geometryType,
            "minScale": 0,
            "maxScale": 0,
            "extent": layer.fullExtent,
            "drawingInfo": {
              "renderer": layer.renderer,
              "transparency": 0,
              "labelingInfo": null
            },
            "hasAttachments": layer.hasAttachments,
            "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
            "objectIdField": layer.objectIdField,
            "globalIdField": layer.globalIdField,
            "typeIdField": layer.typeIdField,
            "fields": array.map(fieldsproc, function (field) {
              // this will properly serialize "description" property as string instead of object.
              return field.toJson();
            }),
            "types": layer.types,
            "templates": layer.templates,
            "capabilities": "Create,Delete,Query,Update,Uploads,Editing",
            "editFieldsInfo": layer.editFieldsInfo === undefined ? null : layer.editFieldsInfo
          }
        };
        var outFields = layer.fields.map(function (f) {
          return f.name;
        });
        // only keep one local layer
        //var existingLayer = this.map.getLayer(layer.id + "_lfl");
        //if (existingLayer) {
        //  this.map.removeLayer(existingLayer);
        //}

        this._eventHandler = this.own(on(layer, "visibility-change", lang.hitch(this, function () {
          /*
          setTimeout(lang.hitch(this, function () {
            var cancelBtn = query(".cancelButton")[0];
            if (!cancelBtn) {
              //do nothing
            } else {
              on.emit(cancelBtn, 'click', { cancelable: true, bubbles: true });
            }
          }), 100);
          */
        })));

        cloneFeaturelayer = new FeatureLayer(featureCollection, {
          id: layer.id + "_lfl",
          outFields: outFields
        });
        cloneFeaturelayer.visible = true;
        cloneFeaturelayer.renderer = layer.renderer;
        cloneFeaturelayer.originalLayerId = layer.id;
        cloneFeaturelayer._wabProperties = { isTemporaryLayer: true };
        this.map.addLayer(cloneFeaturelayer);
        return cloneFeaturelayer;
      },
      _endsWith: function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      },
      _validateEventHandler: function () {
        this._enableAttrInspectorSaveButton(this._validateAttributes());
      },
      _validateAttributes: function (changeDefaultState) {
        //optional param to determine if no rule is found, should it reset the state.
        //Required for when a form is disabled and a rule to hide a field is required
        changeDefaultState = typeof changeDefaultState !== 'undefined' && changeDefaultState !== null ? changeDefaultState : true;
        var attachmentValidationResult = [];
        var attachmentResult = true;
        var rowsWithGDBRequiredFieldErrors = this._validateRequiredFields();
        var featureHasEdits = this._validateFeatureChanged();

        var rowsWithSmartErrors = [];
        var formValid = true;
        if (this._smartAttributes !== undefined) {
          if (this._smartAttributes !== null) {
            rowsWithSmartErrors = this._smartAttributes.toggleFields(changeDefaultState);
          }
        }
        if (this._attributeInspectorTools !== undefined) {
          if (this._attributeInspectorTools !== null) {
            formValid = this._attributeInspectorTools.formValid();
          }
        }
        if (featureHasEdits && this.currentLayerInfo && this.currentLayerInfo.attachmentValidations) {
          array.forEach(this.currentLayerInfo.attachmentValidations.Actions,
            lang.hitch(this, function (action) {
              var attachmentObj = {};
              if (action.filter && this._smartAttributes) {
                attachmentObj.actionType = action.actionName;
                attachmentObj.result = this._smartAttributes.processFilter(action.filter);
                attachmentValidationResult.push(attachmentObj);
              }
            }));
          //Perform action based on feature is being created or updated
          if (this.attrInspector._attachmentUploader) {
            attachmentResult =
              this.performAction(this.attrInspector._attachmentUploader, attachmentValidationResult, true);
          } else if (this.attrInspector._attachmentEditor) {
            attachmentResult =
              this.performAction(this.attrInspector._attachmentEditor, attachmentValidationResult, false);
          }
        }
        return (editUtils.isObjectEmpty(rowsWithGDBRequiredFieldErrors) &&
          rowsWithSmartErrors.length === 0 && formValid && featureHasEdits && attachmentResult);
      },

      performAction: function (node, actions, isUploader) {
        var enableSaveButton = true;
        //Remove message which could be a result of previous required action
        domStyle.set(this.attrInspector.attachmentsRequiredMsg, "display", "none");
        array.some(actions, lang.hitch(this, function (action) {
          switch (action.actionType) {
            case 'Hide':
              if (action.result) {
                //Current Action
                this.currentAction = action.actionType;
                node.currentAction = action.actionType;
                domStyle.set(node.domNode, "display", "none");
                return true;
              }
              domStyle.set(node.domNode, "display", "block");
              break;
            case 'Disabled':
              if (action.result) {
                //Current Action
                this.currentAction = action.actionType;
                node.currentAction = action.actionType;
                if (!isUploader) {
                  this._disableAttachments(node, true, isUploader);
                } else {
                  domStyle.set(node.domNode, "display", "none");
                }
                return true;
              }
              this._disableAttachments(node, false, isUploader);
              domStyle.set(node.domNode, "display", "block");
              break;
            case 'Required':
              if (action.result) {
                //Current Action
                this.currentAction = action.actionType;
                node.currentAction = action.actionType;
                domStyle.set(node.domNode, "display", "block");
                if (!this._hasAddedAnyAttachments(node, isUploader)) {
                  enableSaveButton = false;
                  domStyle.set(this.attrInspector.attachmentsRequiredMsg, "display", "block");
                } else {
                  enableSaveButton = true;
                  domStyle.set(this.attrInspector.attachmentsRequiredMsg, "display", "none");
                }
                return true;
              } else {
                //Clear the current action variable for further processing
                this.currentAction = null;
                node.currentAction = null;
              }
              break;
          }
        }));
        this._setWidgetFirstFocusNode("AI", false);
        return enableSaveButton;
      },

      _disableAttachments: function (node, isDisable, isUploader) {
        var display, warningNode;
        //set the sate of div
        display = isDisable ? "none" : "block";
        if (!isUploader) {
          //get warning node
          warningNode = this.attrInspector._attachmentEditor.domNode;
          if (query(".attwarning", warningNode)[0]) {
            domStyle.set(query(".attwarning", warningNode)[0], "display", display);
          }
          //set the display style
          domStyle.set(node._uploadForm, "display", display);
          //Loop through all the delete button nodes and set the display property as per the state
          array.forEach(node._attachmentList.childNodes, lang.hitch(this, function (childNode) {
            if (childNode.nodeName !== "#text") {
              var deleteButton = query(".deleteAttachment", childNode)[0];
              if (deleteButton) {
                domStyle.set(deleteButton, "display", display);
              }
            }
          }));
        }
      },


      _onUpdateAttachmentListAdd508Support: function () {
        if (this.attrInspector && this.attrInspector._attachmentEditor) {
          aspect.after(this.attrInspector._attachmentEditor, "_updateConnects",
            lang.hitch(this, function () {
              this._add508SupportToAttachmentsDeleteBtn();
            }));
        }
      },

      _add508SupportToAttachmentsDeleteBtn: function () {
        //since aspect.after of _updateConnects gets called multiple time
        //create a timer and execute the following function only once
        if (this._support508ToDeleteButtonTimer) {
          clearInterval(this._support508ToDeleteButtonTimer);
        }
        this._support508ToDeleteButtonTimer = setInterval(lang.hitch(this, function () {
          clearInterval(this._support508ToDeleteButtonTimer);
          if (this.attrInspector._attachmentEditor &&
            this.attrInspector._attachmentEditor._attachmentList) {
            array.forEach(this.attrInspector._attachmentEditor._attachmentList.childNodes,
              lang.hitch(this, function (childNode) {
                if (childNode.nodeName !== "#text") {
                  var deleteButton = query(".deleteAttachment", childNode)[0];
                  if (deleteButton) {
                    domAttr.set(deleteButton, "role", "button");
                    domAttr.set(deleteButton, "tabindex", "0");
                    domAttr.set(deleteButton, "aria-label", this.nls.deleteAttachment);
                    this.own(on(deleteButton, "keydown", lang.hitch(this, function (evt) {
                      if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                        deleteButton.click();
                      }
                    })));
                  }
                }
              }));
          }
        }), 300);
      },

      _hasAddedAnyAttachments: function (node, isUploader) {
        var hasAttachments = false;
        //Check for attachments length and return the flag value
        if (!isUploader) {
          if (node._attachmentList.childNodes.length > 0 &&
            node._attachmentList.childNodes[0].nodeName !== "#text") {
            return true;
          }
          return false;
        }
        for (var i = 0; i < node._attachmentList.childNodes.length; i++) {
          if (node._attachmentList.childNodes[i].childNodes &&
            node._attachmentList.childNodes[i].childNodes.length > 0 &&
            node._attachmentList.childNodes[i].childNodes[1].value) {
            if (node._attachmentList.childNodes[i].childNodes[1].value.length > 0) {
              hasAttachments = true;
              break;
            }
          }
        }
        return hasAttachments;
      },

      _toggleEditGeoSwitch: function (disable) {
        var isVisible = false;
        //return if _editGeomSwitch is not available or
        //traversal length is greater than one i.e. showing attribute inspector of related records
        if (this._editGeomSwitch === undefined || this._editGeomSwitch === null ||
          this._traversal.length > 1) {
          return;
        }
        if (disable === false && this.currentLayerInfo.featureLayer.visibleAtMapScale) {
          if (this.currentLayerInfo && this.currentLayerInfo._editFlag) {
            dojo.style(this._editGeomSwitch.domNode.parentNode, "display", "block");
            isVisible = true;
          } else {
            dojo.style(this._editGeomSwitch.domNode.parentNode, "display", "none");
            isVisible = false;
          }
        }
        else {
          dojo.style(this._editGeomSwitch.domNode.parentNode, "display", "none");
          isVisible = false;
        }
        this._turnEditGeometryToggleOff();
        //Handle the action buttons visibility based on edit geometry switch
        setTimeout(lang.hitch(this, function () {
          //visibility of following buttons is based on visibility of edit checkbox and it's state
          //i.e. if 'Edit Geometry' checkbox is visbile and checked then only show these buttons
          isVisible = isVisible && this._editGeomSwitch.checked;
          this._toggleAttributeButtonVisibility(isVisible);
          this._toggleLocateButtonVisibility(isVisible);
          this._toggleXYCoordinatesButtonVisibility(isVisible);
          this._toggleMapNavigationButtonVisibility(isVisible);
        }), 500);
      },
      _recordLoadeAttInspector: function () {
        this.getConfigDefaults();
      },
      editGeoCheckChange: function () {
        return function () {
          this._editGeometry(this._editGeomSwitch.checked);
        };
      },

      _attributeInspectorChangeRecord: function (evt) {
        //this._turnEditGeometryToggleOff();
        //CT - commented the code in if block as we are displaying Prompt On Save on next button click
        if (this._validateFeatureChanged() && this.currentFeature) {
          // do not show templatePicker after saving
          //   if (this.config.editor.displayPromptOnSave && this.config.editor.displayPromptOnSave === true) {
          //     this._promptToResolvePendingEdit(false, evt, false, true);
          //   }
        } else {
          this._postFeatureSave(evt);
        }
        this._recordLoadeAttInspector();
      },
      _addWarning: function () {
        if (query(".attwarning", this.attrInspector.domNode).length === 0) {
          var txt = domConstruct.create("div", { 'class': 'attwarning' });
          txt.innerHTML = this.nls.attachmentSaveDeleteWarning;
          if (this.attrInspector._attachmentEditor !== undefined &&
            this.attrInspector._attachmentEditor !== null) {
            this.attrInspector._attachmentEditor.domNode.appendChild(txt);
          }

        }
      },

      _hasAnyEditableLayerInRelation: function (layerInfos) {
        var showLayer = false;
        array.forEach(layerInfos, lang.hitch(this, function (layer) {
          if (showLayer) {
            return true;
          }
          if (layer._editFlag === true) {
            showLayer = true;
          } else if (layer.relationshipInfos && layer.relationshipInfos.length > 0) {
            showLayer = this._hasAnyEditableLayerInRelation(layer.relationshipInfos);
          }
        }));
        return showLayer;
      },

      _processRelationAndShowAttrInspector: function (processRelations, evt, layer, def, relatedFeat, isTempFeature) {
        var layerNode;
        if (this.contentWrapper && this.contentWrapper.parentNode &&
          !domClass.contains(this.contentWrapper, "hidden")) {
          this.contentWrapper.parentNode.removeChild(this.contentWrapper);
          if (this.navButtonsDiv &&
            this.navButtonsDiv.parentNode) {
            this.navButtonsDiv.parentNode.removeChild(this.navButtonsDiv);
          }
        }
        //dom for item list and navigation content
        this.contentWrapper = domConstruct.create("div", {
          "class": "detailsContainer"
        }, this.mainContainer);
        //Create pagination controls only for saved feature
        if (!isTempFeature) {
          // dom for navigation buttons
          this.navButtonsDiv = domConstruct.create("div", {
            "class": "esriAttributeInspector esriAttrPaginationDiv"
          });
          domConstruct.place(this.attrInspector.navButtons, this.navButtonsDiv, "first");
          //place the navigation button before main container
          //to make sure only the content have scrollbar
          domConstruct.place(this.navButtonsDiv, this.mainContainer, "before");
        }
        // dom for item list
        var itemListContainer = domConstruct.create("div", {
          "class": "esriCTItemListContainer"
        }, this.contentWrapper);
        if (evt && evt.feature) {
          layer = evt.feature._layer;
          //update symbol of prev selected feature
          if (this.currentFeature && layer.id === this.currentFeature._layer.id) {
            this.currentFeature.setSymbol(this._getSelectionSymbol(
              this.currentFeature.getLayer().geometryType, false));
          }
          //update currentFeature
          this.currentFeature = evt.feature;
          this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
          this.currentLayerInfo = this._getLayerInfoByID(layer.id);
          //Set highlight symbol to current selected feature
          this.currentFeature.setSymbol(this._getSelectionSymbol(
            this.currentFeature.getLayer().geometryType, true));
          //toggle delete button as per current feature
          this._toggleDeleteButton(this.attrInspector._currentLInfo.allowDelete);
          //Disable attachments editor for the layers which are not editable
          //add timeout as it is taking some time to load editor
          this.loading.show();
          setTimeout(lang.hitch(this, function () {
            if (this.attrInspector._attachmentEditor && (!this.currentLayerInfo.isEditable ||
              !this.currentLayerInfo._editFlag)) {
              this._disableAttachments(this.attrInspector._attachmentEditor, true, false);
            }
            this.loading.hide();
          }), 2000);
          //if edit geometry by default is on update the toolbar to edit feature
          //on changing features from AI pagination
          setTimeout(lang.hitch(this, function () {
            if (this.config.editor.hasOwnProperty("editGeometryDefault") &&
              this.config.editor.editGeometryDefault === true) {
              //perform any edit geom switch functionality
              //only when working with main layers feature and not on related features
              if (this._traversal.length < 2) {
                if (this.currentFeature && this.currentFeature.geometry) {
                  // Store the original geometry for later use
                  // layer not having Z value, if have Z value it sould have enableZDefaults to true
                  // layer not having M value, if have M value it sould have allowUpdateWithoutMValues to true
                  this.currentFeature.origGeom = this.currentFeature.geometry.toJson();
                  if (!this.currentLayerInfo.disableGeometryUpdate &&
                    this.currentLayerInfo.featureLayer.visibleAtMapScale &&
                    this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate &&
                    (!this.currentLayerInfo.featureLayer.hasZ ||
                      (this.currentLayerInfo.featureLayer.hasZ && this.currentLayerInfo.featureLayer.enableZDefaults)) &&
                    (!this.currentLayerInfo.featureLayer.hasM ||
                      (this.currentLayerInfo.featureLayer.hasM && this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues))) {
                    this._activateEditToolbar(this.currentFeature);
                    //Added else if to solve the issue when feature is created and have disable geometry,
                    //once after saving the feature after editing geometry,
                    //the checkbox gets hidden but the tool remains active to edit geometry
                  } else if (this.editToolbar.getCurrentState().tool !== 0) {
                    this.editToolbar.deactivate();
                    this._editingEnabled = false;
                  }

                }
              }
            }
          }), 1000);
        }
        if (layer) {
          layerNode = this.addItem(layer.name, true, itemListContainer, layer.id, isTempFeature, layer);
        }
        if (processRelations && evt.feature) {
          if (this._traversal.length > 0) {
            this._traversal[this._traversal.length - 1] = evt.feature._layer.id;
          } else {
            this._traversal.push(evt.feature._layer.id);
          }
          //check for the relationship of selected features layer
          var relatedTableInfos = this._getRelationshipInfo(evt.feature);
          var feature = {
            "attributes": lang.clone(evt.feature.attributes),
            "_layer": evt.feature._layer
          };
          var relatedOBJID;
          if (relatedFeat) {
            relatedOBJID = [];
            array.forEach(relatedFeat, function (feat) {
              relatedOBJID.push(feat.attributes[feat._layer.objectIdField]);
            });
          }
          if (relatedTableInfos && relatedTableInfos.length > 0) {
            var filterdRelatedInfos = [];
            array.forEach(relatedTableInfos, lang.hitch(this, function (relationship) {
              var showRelatedLayer = relationship._editFlag;
              if (!relationship._editFlag &&
                relationship.relationshipInfos && relationship.relationshipInfos.length > 0) {
                showRelatedLayer =
                  this._hasAnyEditableLayerInRelation(relationship.relationshipInfos);
              }
              if (showRelatedLayer &&
                relationship.featureLayer && relationship.hasOwnProperty('relationshipId')) {
                filterdRelatedInfos.push(relationship);
              }
            }));
            if (filterdRelatedInfos.length > 0) {
              var contentPanel = query(".esriCTItemContent", itemListContainer);
              if (contentPanel && contentPanel[0]) {
                domClass.remove(contentPanel[0], "esriCTRelatedItemContent");
              }
              this._relatedTablesInfo[evt.feature._layer.id] = {};
              this._relatedTablesInfo[evt.feature._layer.id] = new relatedTables({
                relationshipInfo: filterdRelatedInfos,
                layerInfosObj: this._jimuLayerInfos,
                parentFeature: feature,
                parentFeatureIndexInAI: this.attrInspector._featureIdx,
                parentFieldInfos: this.currentLayerInfo.fieldInfos,
                config: this.config,
                nls: this.nls,
                mapSpatialReference: this.map.spatialReference
              }, domConstruct.create('div'));
              this.own(on(this._relatedTablesInfo[evt.feature._layer.id], "addRelatedRecord",
                lang.hitch(this,
                  function (relatedNewFeature, relatedDomNode, layerId, parentFeatureIndexInAI, fKeyField) {
                    //hide parent features content
                    domClass.add(this.contentWrapper, "hidden");
                    domClass.add(this.buttonHeader, "hidden");
                    domStyle.set(this.navButtonsDiv, "display", "none");
                    //Store the parent features index in AI object
                    this.attrInspector.ctStoredFeatureIndex = parentFeatureIndexInAI;
                    //push the AI, ContentWrapper and Parent layerID in an array
                    this._attributeInspectorCollection.push(this.attrInspector);
                    this._nodesCollection.push(this.contentWrapper);
                    this._buttonsWrapper.push(this.buttonHeader);
                    this._paginationNodeCollection.push(this.navButtonsDiv);
                    this._traversal.push(layerId);
                    //store related layer/tables dom which will be used to click once feature is saved
                    this.currentRelatedDom = relatedDomNode;
                    //finally add the feature to local layer
                    this._addRelatedFeatureToLocalLayer(relatedNewFeature, fKeyField);
                    this._addingNewRelatedRecord = true;
                  })));
              this.own(on(this._relatedTablesInfo[evt.feature._layer.id], "titleClicked",
                lang.hitch(this, function (layerId, relationshipId, isNewFeature,
                  parentFeatureIndexInAI, parentOID, fKeyField) {
                  if (this.addNewRelatedRecord) {
                    isNewFeature = true;
                    this.addNewRelatedRecord = false;
                  }
                  this._editGeomSwitch.set("checked", false);
                  if (!isNewFeature && this.currentFeature &&
                    this.config.editor.displayPromptOnSave && this._validateFeatureChanged()) {
                    this._promptToResolvePendingEdit(false, null, true).then(lang.hitch(this, function () {
                      this._fetchRelatedRecords(isNewFeature, evt.feature._layer,
                        relationshipId, layerId, parentOID, parentFeatureIndexInAI, relatedOBJID, fKeyField);
                      //reset the relatedOBJID variable once used as it fetches the wrong results next time
                      relatedOBJID = null;
                    }), function () {
                    });
                  } else {
                    this._fetchRelatedRecords(isNewFeature, evt.feature._layer,
                      relationshipId, layerId, parentOID, parentFeatureIndexInAI, relatedOBJID, fKeyField);
                    //reset the relatedOBJID variable once used as it fetches the wrong results next time
                    relatedOBJID = null;
                  }
                })));
              this.own(on(this._relatedTablesInfo[evt.feature._layer.id], "addRelatedItemContent",
                lang.hitch(this,
                  function (isRelatedRequired) {
                    if (isRelatedRequired) {
                      this.addItem(this.nls.relatedItemTitle, false, itemListContainer, null, false);
                    } else {
                      var contentPanel = query(".esriCTItemContent", itemListContainer);
                      if (contentPanel && contentPanel[0]) {
                        domClass.add(contentPanel[0], "esriCTRelatedItemContent");
                      }
                    }
                  })));
              this._relatedTablesInfo[evt.feature._layer.id].startup();
            } else {
              this._disableToggling(layerNode);
            }
          } else {
            this._disableToggling(layerNode);
          }
          if (def) {
            def.resolve();
          }
        } else {
          if (def) {
            def.resolve();
          }
        }
      },

      _checkValidRelationShips: function (filterdRelatedInfos, layer) {
        array.forEach(filterdRelatedInfos, lang.hitch(this, function (relationship) {
          if (relationship.featureLayer && relationship.hasOwnProperty('relationshipId')) {
            var relation;
            array.some(layer.relationships, lang.hitch(this, function (relationship) {
              //Return relationship
              if (relationship.id === relationshipId) {
              }
            }));
          }
        }));
      },

      _fetchRelatedRecords: function (isNewFeature, layer,
        relationshipId, layerId, parentOID, parentFeatureIndexInAI, relatedOBJID, fKeyField) {
        //get related records for the selected layer/table
        this._getRelatedRecordsByRelatedQuery(
          layer, relationshipId, layerId, parentOID).then(lang.hitch(this, function (oIds) {
            if (oIds && oIds.length === 0) {
              if (isNewFeature) {
                domClass.remove(this.contentWrapper, "hidden");
                this.attrInspector.refresh();
                setTimeout(lang.hitch(this, function () {
                  domStyle.set(this.attrInspector.navButtons, "display",
                    (!this.attrInspector._hideNavButtons && (this.attrInspector._numFeatures > 1) ? "" : "none"));
                  this.attrInspector.navMessage.innerHTML = esriLang.substitute({
                    idx: this.attrInspector._featureIdx + 1,
                    of: this.attrInspector.NLS_of,
                    numFeatures: this.attrInspector._numFeatures
                  }, this.attrInspector._navMessage);
                  this.currentFeature = this.attrInspector._numFeatures ?
                    this.attrInspector._selection[this.attrInspector._featureIdx] : null;
                  this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
                }), 200);
              }
              return;
            }
            domClass.add(this.contentWrapper, "hidden");
            domStyle.set(this.navButtonsDiv, "display", "none");
            //store AI's _featureIdx which will be used when coming back to parent feature
            this.attrInspector.ctStoredFeatureIndex = parentFeatureIndexInAI;
            this._attributeInspectorCollection.push(this.attrInspector);
            this._nodesCollection.push(this.contentWrapper);
            this._buttonsWrapper.push(this.buttonHeader);
            this._paginationNodeCollection.push(this.navButtonsDiv);
            //push selected layer's id
            this._traversal.push(layerId);
            if (relatedOBJID) {
              oIds = [];
              oIds = relatedOBJID;
              relatedOBJID = null;
            }
            if (oIds && oIds.length > 0) {
              var newDef, queryObj = new Query();
              queryObj.objectIds = oIds;
              if (this.viewedLayerDetails.length > 0) {
                newDef = new Deferred();
                var tempFeature = this.viewedFeatureDetails[0];
                if (this.viewedLayerDetails[0] === this.viewedLayerDetails[1]) {
                  tempFeature = this.viewedFeatureDetails[1];
                }
                this._createAttributeInspector([this._getLayerInfoByID(layerId)], false, null,
                  newDef, tempFeature, fKeyField);
              } else {
                this._createAttributeInspector([this._getLayerInfoByID(layerId)], false, null,
                  null, null, fKeyField);
              }
              var relatedLayer = this._jimuLayerInfos.getLayerOrTableInfoById(layerId).layerObject;
              this.loading.show();
              relatedLayer.selectFeatures(queryObj, FeatureLayer.SELECTION_NEW,
                lang.hitch(this, function (selectedFeatures) {
                  //if adding new related record or while adding new related record back button is clicked
                  //then empty the current feature as it will enter in next callback of ATI when we the last record is selected
                  if ((this._addingNewRelatedRecord && this._processBackButtonInNewRelatedRecord) || isNewFeature) {
                    this.currentFeature = null;
                  }
                  //update the features
                  this.updateFeatures = selectedFeatures;
                  //If new feature is created go to the last feature of attribute inspector
                  if (isNewFeature) {
                    this.attrInspector.last();
                  } else {
                    this.attrInspector.first();
                  }
                  //update current feature
                  this.currentFeature = this.attrInspector._numFeatures ?
                    this.attrInspector._selection[this.attrInspector._featureIdx] : null;
                  this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
                  if (this.updateFeatures.length > 0) {
                    this._showTemplate(false);
                  }
                  if (this._addingNewRelatedRecord && this._processBackButtonInNewRelatedRecord) {
                    this._addingNewRelatedRecord = false;
                    this._processBackButtonInNewRelatedRecord = false;
                    this._onCancelButtonClicked();
                  }
                  this.loading.hide();
                }),
                lang.hitch(this, function () {
                  this.loading.hide();
                }));
              if (newDef) {
                newDef.then(lang.hitch(this, function () {
                  if (this.viewedLayerDetails.length > 0) {
                    var relatedFeatureLayerId = this.viewedLayerDetails.shift();
                    var relatedFeatures = this.viewedFeatureDetails.shift();
                    if (this.viewedLayerDetails.length > 0 && this.viewedLayerDetails[0] === relatedFeatureLayerId) {
                      this.viewedLayerDetails.shift();
                      relatedFeatures = this.viewedFeatureDetails.shift();
                    }
                    var tableTitle = query("[layerid='" + relatedFeatureLayerId + "']", this.contentWrapper)[0];
                    tableTitle.click();
                  }
                  if (this.viewedLayerDetails.length === 0) {
                    this.loading.hide();
                  }
                }));
              }
            }
          }));
      },

      _createAttributeInspector: function (layerInfos, featureCreated, layer, def, feature, fKeyField) {
        var attachmentRefNode, refreshButtonClass, refreshButtonTitle, canShowLocateButton;
        //perform any edit geom switch functionality
        //only when working with main layers feature and not on related features
        //destroy the edit geom switch
        if (this._traversal.length < 2) {
          if (this._editGeomSwitch) {
            this._editGeomSwitch.destroy();
            this._editGeomSwitch = null;
          }

          if (this.editSwitchDiv) {
            while (this.editSwitchDiv.firstChild) {
              this.editSwitchDiv.removeChild(this.editSwitchDiv.firstChild);
            }
          }
        }
        this._setCancelButtonText();
        if (this.attrInspector) {
          //  this.attrInspector.destroy();
          //  this.attrInspector = null;

        }

        //if related feature is selected, disable the foreign key field in attribute inspector
        if (fKeyField) {
          array.forEach(layerInfos[0].fieldInfos, lang.hitch(this, function (field) {
            if (field.name === fKeyField) {
              field.isEditable = false;
            }
          }));
        }

        //Show textArea instead of text boxes - fix for github ticket #248
        if (this.config.editor.hasOwnProperty("canSwitchToMultilineInput") &&
          this.config.editor.canSwitchToMultilineInput) {
          //loop through all the laeyr infos and its fieldinfos
          array.forEach(layerInfos, lang.hitch(this, function (layer) {
            if (layer.fieldInfos) {
              array.forEach(layer.fieldInfos, lang.hitch(this, function (field) {
                if (field.type === "esriFieldTypeString" &&
                  (!field.hasOwnProperty("stringFieldOption") ||
                    field.stringFieldOption === "textbox") &&
                  this.config.editor.maxLimitToMultilineTextBox < field.length) {
                  field.stringFieldOption = "textarea";
                }
              }));
            }
          }));
        }

        this.attrInspector = editUtils.ATI({//new AttributeInspector({
          layerInfos: layerInfos
        }, html.create("div", {
          style: {
            width: "100%",
            height: "100%"
          }
        }));
        this.attrInspector.startup();
        //after creating attachment list handle 508 support to delete attachment buttons
        this._onUpdateAttachmentListAdd508Support();
        domConstruct.place(this.attrInspector.navMessage, this.attrInspector.nextFeatureButton.domNode, "before");
        //perform any edit geom switch functionality
        //only when working with main layers feature and not on related features
        if (this._traversal.length < 2) {
          this.editSwitchDiv = domConstruct.create("div");
          this.editSwitchDiv.appendChild(domConstruct.create("div", { "class": "spacer" }));
          // edit geometry toggle button
          this._editGeomSwitch = new CheckBox({
            id: "editGeometrySwitch_" + this.attrInspector.id,
            checked: false,
            value: this.nls.editGeometry,
            tabindex: 0, // code for accessibility
            label: this.nls.editGeometry
          }, null);

          domAttr.set(registry.byId("editGeometrySwitch_" + this.attrInspector.id).domNode,
            "aria-label", this.nls.editGeometry);

          this.editSwitchDiv.appendChild(this._editGeomSwitch.domNode);

          /* domConstruct.place(lang.replace(
            "<label for='editGeometrySwitch_'" + this.attrInspector.id + ">{replace}</label></br></br>",
            { replace: this.nls.editGeometry }), this._editGeomSwitch.domNode, "after"); */

          domConstruct.place(this.editSwitchDiv, this.attrInspector.deleteBtn.domNode, "before");

          this.own(on(this._editGeomSwitch, 'Change', lang.hitch(this,
            this.editGeoCheckChange())));

          // to create container for custom coordinates
          this._xyCoordinates = domConstruct.create("div", {
            "class": "esriCTActionButtons esriCTCustomButtons esriCTXYCoordinates esriCTGeometryEditor hidden",
            "title": this.nls.moveSelectedFeatureToXY,
            "tabindex": 0, // code for accessibility
            "role": "button",
            "aria-label": this.nls.moveSelectedFeatureToXY
          }, this.attrInspector.deleteBtn.domNode, "after");

          this.own(on(this._xyCoordinates, 'click', lang.hitch(this,
            function () {
              this._createCoordinatesPopup();
            })));

          this.own(on(this._xyCoordinates, 'keydown',
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._createCoordinatesPopup();
              }
            })));



          // to create container for locate button
          // esriCTGeometryEditor is a common css class, that deals with margin values
          this._locateButtonDiv = domConstruct.create("div", {
            "class": "esriCTActionButtons esriCTCustomButtons esriCTLocateButtonContainer esriCTGeometryEditor hidden",
            "title": this.nls.moveSelectedFeatureToGPS,
            "tabindex": 0,
            "role": "button",
            "aria-label": this.nls.moveSelectedFeatureToGPS
          }, this.attrInspector.deleteBtn.domNode, "after");
          // current location button object
          this._locateButton = new LocateButton({
            map: this.map,
            highlightLocation: false,
            setScale: false,
            centerAt: true
          }, domConstruct.create("div"));
          this._locateButton.startup();
          canShowLocateButton = this._locateButton.domNode.style.display;
          if (canShowLocateButton === "none") {
            domStyle.set(this._locateButtonDiv, 'display', canShowLocateButton);
          }
          // to get the current location when keydown on locate button
          this.own(on(this._locateButtonDiv, 'keydown',
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._locateButton.locate();
              }
            })));
          // to get the current location when clicked on locate button
          this.own(on(this._locateButton, 'locate', lang.hitch(this, function (currentLocation) {
            // display error if fetching current location fails
            // current location functionality only works with https i.e; secured services
            // application should be executed in https mode
            if (currentLocation.error && currentLocation.error.message) {
              Message({
                message: currentLocation.error.message
              });
            } else {
              if (currentLocation && currentLocation.graphic && currentLocation.graphic.geometry) {
                // In case of point geometry, set current selected feature geometry as current location geometry
                this.currentFeature.setGeometry(currentLocation.graphic.geometry);
                // once current feature is moved to current location, execute this function for further process
                this.geometryEdited();
              }
            }
          })));
          // on click of locate button container, execute locate function
          this.own(on(this._locateButtonDiv, 'click', lang.hitch(this, function () {
            // locate current position on click of its container
            this._locateButton.locate();
          })));

          // to create container for map navigation icon
          this._mapNavigation = domConstruct.create("div", {
            "class": "esriCTActionButtons esriCTCustomButtons esriCTMapNavigationLocked esriCTGeometryEditor hidden",
            "title": this.nls.mapNavigationLocked,
            "tabindex": 0,
            "role": "button",
            "aria-label": this.nls.mapNavigationLocked
          }, this.attrInspector.deleteBtn.domNode, "after");

          this.own(on(this._mapNavigation, 'click',
            lang.hitch(this, this._toggleMapNavigationButtonState)));

          this.own(on(this._mapNavigation, 'keydown',
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._toggleMapNavigationButtonState();
              }
            })));

          // Button to refresh attributes on geometry change
          if (this.config.editor.enableAttributeUpdates) {
            refreshButtonClass = "refreshAttributes";
            refreshButtonTitle = this.nls.refreshAttributes;
          }
          if (this.config.editor.enableAutomaticAttributeUpdates) {
            refreshButtonClass = "esriCTAutoUpdateOnMode";
            refreshButtonTitle = this.nls.automaticAttributeUpdatesOn;
          }
          this._refreshButton = domConstruct.create("div", {
            "class": refreshButtonClass + " " + "esriCTActionButtons esriCTCustomButtons esriCTGeometryEditor hidden",
            "title": refreshButtonTitle,
            "tabindex": 0, // code for accessibilty
            "role": "button",
            "aria-label": refreshButtonTitle

          }, this.attrInspector.deleteBtn.domNode, "after");
          this.own(on(this._refreshButton, 'click', lang.hitch(this, function () {
            if (this.config.editor.enableAutomaticAttributeUpdates) {
              this._toggleAttributeButtonState();
            } else {
              this._refreshAttributes();
            }
          })));
          this.own(on(this._refreshButton, 'keydown',
            lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                if (this.config.editor.enableAutomaticAttributeUpdates) {
                  this._toggleAttributeButtonState();
                } else {
                  this._refreshAttributes();
                }
              }
            })));
        }
        // save button
        domConstruct.create("div", {
          innerHTML: this.nls.save,
          "class": "esriCTCustomButtons saveButton jimu-btn jimu-state-disabled",
          "style": "visibility: hidden"
        }, this.attrInspector.deleteBtn.domNode, "after");

        if (this.buttonHeader) {
          domClass.add(this.buttonHeader, "hidden");
        }
        this.buttonHeader = domConstruct.create("div", {
          "class": "buttonHeader"
        }, this.buttonWrapper);

        // save button
        var saveButton = domConstruct.create("div", {
          innerHTML: this.nls.save,
          "class": "esriCTCustomButtons saveButton jimu-btn jimu-state-disabled",
          "tabindex": "-1",
          "role": "button",
          "aria-label": this.nls.save
        }, this.buttonHeader, "last");

        //Hide Attribute inspector's delete button
        domStyle.set(this.attrInspector.deleteBtn.domNode, "display", "none");

        //add another process indicator
        //domConstruct.create("div", {
        //  "class": "processing-indicator"
        //}, saveButton, "before");
        if (query(".deleteButton", this.buttonHeader).length < 1) {
          var deleteButton = domConstruct.create("div", {
            innerHTML: this.nls.deleteText,
            "tabindex": "-1",
            "role": "button",
            "aria-label": this.nls.deleteText,
            "class": "deleteButton jimu-btn jimu-btn-vacation"
          }, saveButton, "before");
          // query(".jimu-widget-smartEditor .topButtonsRowDiv")[0], "first");

          on(deleteButton, "click", lang.hitch(this, function () {
            this._onDeleteButtonClick();
          }));
          on(deleteButton, "keydown", lang.hitch(this, function (evt) {
            if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
              this._onDeleteButtonClick();
            }
          }));
        }

        //Change the position of action buttons(save/delete) based on configuration
        if (this.config.editor.showActionButtonsAbove) {
          domStyle.set(this.mainContainer, "margin-top", "5px");
        } else {
          domConstruct.place(this.buttonWrapper, this.mainContainer, "after");
          domStyle.set(this.mainContainer, "margin-bottom", "5px");
          domStyle.set(this.mainContainer, "margin-top", "0px");
        }

        this.own(on(saveButton, "click", lang.hitch(this, function () {
          if (!this._validateFeatureChanged()) {
            this._resetEditingVariables();
            return;
          }

          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }
          this._saveEdit(this.currentFeature);
        })));

        //handle keydown event for save button
        this.own(on(saveButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            if (!this._validateFeatureChanged()) {
              this._resetEditingVariables();
              return;
            }
            if (this.map.infoWindow.isShowing) {
              this.map.infoWindow.hide();
            }
            this._saveEdit(this.currentFeature);
          }
        })));

        //Code to support selection updated from select widget
        //Listen for onLayerSelectionChange
        aspect.after(this.attrInspector, "onLayerSelectionChange",
          lang.hitch(this, function () {
            if (this.state !== 'active') {
              if (this._LayerSelectionChangedTimer) {
                clearTimeout(this._LayerSelectionChangedTimer);
              }
              this._LayerSelectionChangedTimer = setTimeout(lang.hitch(this, function () {
                if (this.attrInspector) {
                  this.attrInspector.first();
                }
              }), 500);
            }
          }));
        //Listen for all the necessary events
        if (this.attrInspector._attachmentEditor) {
          //Listen for delete attachments event
          aspect.after(this.attrInspector._attachmentEditor, "_onDeleteAttachmentComplete",
            lang.hitch(this, function () {
              //If "Required" action is performed and at no attachment is present
              //show the required message
              if (!this._hasAddedAnyAttachments(this.attrInspector._attachmentEditor, false) &&
                this.currentAction === "Required") {
                domStyle.set(this.attrInspector.attachmentsRequiredMsg, "display", "block");
              }
              this._enableAttrInspectorSaveButton(this._validateAttributes());
            }));
          //Listen for attachments complete event
          aspect.after(this.attrInspector._attachmentEditor, "_onAddAttachmentComplete",
            lang.hitch(this, function () {
              if (domStyle.get(this.attrInspector.attachmentsRequiredMsg, "display") === "block") {
                domStyle.set(this.attrInspector.attachmentsRequiredMsg, "display", "none");
              }
              this._enableAttrInspectorSaveButton(this._validateAttributes());
            }));
          //Listen for all the attachments complete event
          aspect.after(this.attrInspector._attachmentEditor, "_getAttachments",
            lang.hitch(this, function () {
              this.attachmentloading.show();
              setTimeout(lang.hitch(this, function () {
                if (this.currentLayerInfo && this.currentLayerInfo.attachmentValidations) {
                  if (this.currentLayerInfo.attachmentValidations) {
                    var attachmentValidationResult = [];
                    array.forEach(this.currentLayerInfo.attachmentValidations.Actions,
                      lang.hitch(this, function (action) {
                        var attachmentObj = {};
                        if (action.filter && this._smartAttributes) {
                          attachmentObj.actionType = action.actionName;
                          attachmentObj.result = this._smartAttributes.processFilter(action.filter);
                          attachmentValidationResult.push(attachmentObj);
                        }
                      }));
                    if (this.attrInspector._attachmentUploader) {
                      this.performAction(this.attrInspector._attachmentUploader, attachmentValidationResult, true);
                    } else {
                      this.performAction(this.attrInspector._attachmentEditor, attachmentValidationResult, false);
                    }
                  }
                  //Disable attachments editor for the layers which are not editable
                  //add timeout as it is taking some time to load editor
                  if (this.attrInspector._attachmentEditor && (!this.currentLayerInfo.isEditable ||
                    !this.currentLayerInfo._editFlag)) {
                    this._disableAttachments(this.attrInspector._attachmentEditor, true, false);
                  }
                }
                this.attachmentloading.hide();
              }), 1500);
            }));
        }
        // edit geometry checkbox event

        // attribute inspector events
        this.own(on(this.attrInspector, "attribute-change", lang.hitch(this, function (evt) {
          if (this.currentFeature) {
            this.currentFeature.attributes[evt.fieldName] = evt.fieldValue;
            this._enableAttrInspectorSaveButton(this._validateAttributes());
          }
        })));

        this.own(on(this.attrInspector, "next", lang.hitch(this, function (evt) {
          if (this.currentFeature && this.config.editor.displayPromptOnSave && this._validateFeatureChanged()) {
            this._promptToResolvePendingEdit(false, null, false).then(
              lang.hitch(this, function () {
                this._processNextButtonClicked(true, evt, null, def, feature);
              }), function () {
              });
          } else {
            //gitHub ticket : 120
            //if feature is edited but not saved and user moved to next feature,
            //then revert the attributes and geometry to orginal one
            if (this.currentFeature) {
              if (this.currentFeature.preEditAttrs) {
                this.currentFeature.attributes = JSON.parse(JSON.stringify(this.currentFeature.preEditAttrs));
              }
              if (this.currentFeature.origGeom) {
                this.currentFeature.geometry = geometryJsonUtil.fromJson(this.currentFeature.origGeom);
              }
            }
            this._processNextButtonClicked(true, evt, null, def, feature);
          }
        })));

        this.attrInspector.attachmentsRequiredMsg = domConstruct.create("div", {
          "innerHTML": this.nls.attachmentsRequiredMsg,
          "role": "presentation",
          "aria-label": this.nls.attachmentsRequiredMsg.replace("(*)", ""),
          "tabindex": "0",
          "style": "display:none;color:red;margin-top:5px"
        });
        if (layerInfos.length === 1) {
          if (layerInfos[0].featureLayer.hasOwnProperty('originalLayerId')) {
            var result = this._getLayerInfoByID(layerInfos[0].featureLayer.originalLayerId);
            if (result.featureLayer.hasAttachments === true) {
              var attachNode = domConstruct.create("div");
              domConstruct.place(attachNode, this.attrInspector.attributeTable, "after");
              this.attrInspector._attachmentUploader = new AttachmentUploader(
                {
                  'class': 'atiAttachmentEditor',
                  attachmentsRequiredMsg: this.attrInspector.attachmentsRequiredMsg,
                  currentAction: this.currentAction,
                  deleteAttachmentText: this.nls.deleteAttachment
                },
                attachNode);
              this.attrInspector._attachmentUploader.startup();
              on(this.attrInspector._attachmentUploader, "attachmentAdded",
                lang.hitch(this, function () {
                  this._enableAttrInspectorSaveButton(this._validateAttributes());
                }));
              on(this.attrInspector._attachmentUploader, "attachmentDeleted",
                lang.hitch(this, function () {
                  this._enableAttrInspectorSaveButton(this._validateAttributes());
                }));
            }
          }
        }

        //Place the attachments warning as per create/edit mode
        if (this.attrInspector._attachmentUploader) {
          attachmentRefNode = this.attrInspector._attachmentUploader.domNode;
        } else if (this.attrInspector._attachmentEditor) {
          attachmentRefNode = this.attrInspector._attachmentEditor.domNode;
        }
        //If node exist, create message and add it to node
        if (attachmentRefNode) {
          domConstruct.place(this.attrInspector.attachmentsRequiredMsg, attachmentRefNode, "before");
        }
        if (featureCreated) {
          this._processRelationAndShowAttrInspector(false, null, layer, null, null, true);
        }
        setTimeout(lang.hitch(this, function () {
          if (this.config.editor.removeOnSave && this.attrInspector._numFeatures === 0) {
            this._setWidgetFirstFocusNode("templatePicker", true);
          } else {
            this._setWidgetFirstFocusNode("AI", true);
          }
        }), 1000);
      },

      _onDeleteButtonClick: function () {
        if (this.map.infoWindow.isShowing) {
          this.map.infoWindow.hide();
        }

        if (this.config.editor.displayPromptOnDelete) {
          this._promptToDelete();

        } else {
          this._deleteFeature();
        }
      },


      _processNextButtonClicked: function (processRelations, evt, layer, def, feature) {
        this._processRelationAndShowAttrInspector(processRelations, evt, layer, def, feature, false);
        this._attributeInspectorChangeRecord(evt);
        this._addWarning();
        this._toggleAttrInspectorNavButtons();
      },

      _toggleDeleteButton: function (show) {
        var deleteButton;
        deleteButton = query(".deleteButton", this.buttonHeader);
        if (deleteButton.length > 0) {
          deleteButton = deleteButton[0];
          if (show === true) {
            deleteButton.style.display = "block";
            domAttr.set(deleteButton, "tabindex", "0");
          } else {
            deleteButton.style.display = "none";
            domAttr.set(deleteButton, "tabindex", "-1");
          }
        }
      },

      _activateTemplateToolbar: function (override) {

        var draw_type = override || null;
        var shape_type = null;
        if (this.templatePicker) {
          var selectedTemplate = this.templatePicker.getSelected();
          if (selectedTemplate && selectedTemplate !== null) {
            shape_type = selectedTemplate.featureLayer.geometryType;
            if (selectedTemplate.template !== undefined && selectedTemplate.template !== null &&
              selectedTemplate.template.drawingTool !== undefined && selectedTemplate.template.drawingTool !== null) {
              switch (selectedTemplate.template.drawingTool) {
                case "esriFeatureEditToolNone":
                  switch (selectedTemplate.featureLayer.geometryType) {
                    case "esriGeometryPoint":
                      draw_type = draw_type !== null ? draw_type : Draw.POINT;
                      break;
                    case "esriGeometryPolyline":
                      draw_type = draw_type !== null ? draw_type : Draw.POLYLINE;
                      break;
                    case "esriGeometryPolygon":
                      draw_type = draw_type !== null ? draw_type : Draw.POLYGON;
                      break;
                  }
                  break;
                case "esriFeatureEditToolPoint":
                  draw_type = draw_type !== null ? draw_type : Draw.POINT;
                  break;
                case "esriFeatureEditToolLine":
                  draw_type = draw_type !== null ? draw_type : Draw.POLYLINE;
                  break;
                case "esriFeatureEditToolAutoCompletePolygon":
                case "esriFeatureEditToolPolygon":
                  draw_type = draw_type !== null ? draw_type : Draw.POLYGON;
                  break;
                case "esriFeatureEditToolCircle":
                  draw_type = draw_type !== null ? draw_type : Draw.CIRCLE;
                  break;
                case "esriFeatureEditToolEllipse":
                  draw_type = draw_type !== null ? draw_type : Draw.ELLIPSE;
                  break;
                case "esriFeatureEditToolRectangle":
                  draw_type = draw_type !== null ? draw_type : Draw.RECTANGLE;
                  break;
                case "esriFeatureEditToolFreehand":
                  switch (selectedTemplate.featureLayer.geometryType) {
                    case "esriGeometryPoint":
                      draw_type = draw_type !== null ? draw_type : Draw.POINT;
                      break;
                    case "esriGeometryPolyline":
                      draw_type = draw_type !== null ? draw_type : Draw.FREEHAND_POLYLINE;
                      break;
                    case "esriGeometryPolygon":
                      draw_type = draw_type !== null ? draw_type : Draw.FREEHAND_POLYGON;
                      break;
                  }
                  break;
                default:
                  switch (selectedTemplate.featureLayer.geometryType) {
                    case "esriGeometryPoint":
                      draw_type = draw_type !== null ? draw_type : Draw.POINT;
                      break;
                    case "esriGeometryPolyline":
                      draw_type = draw_type !== null ? draw_type : Draw.POLYLINE;
                      break;
                    case "esriGeometryPolygon":
                      draw_type = draw_type !== null ? draw_type : Draw.POLYGON;
                      break;
                  }
                  break;
              }
            }
            else {
              switch (selectedTemplate.featureLayer.geometryType) {
                case "esriGeometryPoint":
                  draw_type = draw_type !== null ? draw_type : Draw.POINT;
                  break;
                case "esriGeometryPolyline":
                  draw_type = draw_type !== null ? draw_type : Draw.POLYLINE;
                  break;
                case "esriGeometryPolygon":
                  draw_type = draw_type !== null ? draw_type : Draw.POLYGON;
                  break;
              }
            }
            this.drawToolbar.activate(draw_type);
            this._setDrawingToolbar(shape_type, draw_type);

          }

          else if (this.drawToolbar) {
            this._setDrawingToolbar("select", null);
            this.drawToolbar.deactivate();
            // this._lastDrawnShape = null;
          }
        }
        else if (this.drawToolbar) {
          this._setDrawingToolbar("select", null);
          this.drawToolbar.deactivate();
          //this._lastDrawnShape = null;
        }
      },
      _templatePickerNeedsToBeCreated: function () {
        //if (this.templatePicker === undefined || this.templatePicker === null) {
        //  return true;
        //}
        return true;
        //var recreate = array.some(layers, function (layer) {
        //  var layerMatches = array.some(this.templatePicker.featureLayers, function (tpLayer) {
        //    return tpLayer.id === layer.id;
        //  });
        //  if (layerMatches === false) {
        //    return true;
        //  }
        //  return false;
        //}, this);
        //return recreate;
      },

      /* CT - Commented the code as it was clearing parent features selection when moving to related feature
      _layerChangeOutside: function () {
        if (this._attrInspIsCurrentlyDisplayed && this._attrInspIsCurrentlyDisplayed === true) {
          if (this.attrInspector) {
            if (this.attrInspector._numFeatures === 0) {
              this._showTemplate(true);

            }
          }
        }
      },
      */

      _drawingToolClick: function (shapeType, options) {
        return function () {
          // As soon as user clicks on any of the drawing tool,
          // update the "currentDrawType" variable which contains
          // selected drawing tool option.
          if (options.hasOwnProperty("_drawType")) {
            this.currentDrawType = options._drawType;
          }
          if (options.hasOwnProperty("_drawType") && options._drawType === "SELECT") {
            this.drawingTool.set('label', options.label);
            this.drawingTool.set('iconClass', options.iconClass);
            if (this.drawToolbar) {
              this.drawToolbar.deactivate();
            }
            if (this._selectTool) {
              this._selectTool.setFeatureLayers(this._getOrClearSelectableLayers(false));
              this._selectTool.activate();
            }
          } else if (shapeType !== "select") {
            this.drawingTool.set('label', options.label);
            this.drawingTool.set('iconClass', options.iconClass);
            if (this._selectTool && this._selectTool.isActive()) {
              this._selectTool.deactivate();
              //After deactivating select tool infowindow gets enabled so disable it
              this.map.setInfoWindowOnClick(false);
            }
            if (options.hasOwnProperty("_drawType")) {
              this.drawToolbar.activate(options._drawType);
            }
            this.currentShapeType = shapeType;
          }
        };
      },
      _menus: {},
      drawingTool: null,
      _setDrawingToolbar: function (shapeType, drawType) {
        if (this.drawingTool === null || this.drawingTool === undefined) {
          return;
        }
        if (this.currentShapeType === null ||
          this.currentShapeType === undefined ||
          this.currentShapeType !== shapeType) {
          this.drawingTool.set('dropDown', this._menus[shapeType]);
        }

        this.currentShapeType = shapeType;

        this.currentDrawType = null;

        array.some(SEDrawingOptions[shapeType], function (options) {
          if ((options.hasOwnProperty("_drawType") && options._drawType === drawType) ||
            drawType === null) {
            this.drawingTool.set('label', options.label);
            this.drawingTool.set('iconClass', options.iconClass);
            this.currentDrawType = options._drawType;
            return true;
          }
          else {
            return false;
          }
        }, this);

        //if the proper type was not found, set to first
        if (this.currentDrawType === null || this.currentDrawType === undefined) {
          this.drawingTool.set('label', SEDrawingOptions[shapeType][0].label);
          this.drawingTool.set('iconClass', SEDrawingOptions[shapeType][0].iconClass);
          if (SEDrawingOptions[shapeType][0].hasOwnProperty("_drawType")) {
            this.currentDrawType = SEDrawingOptions[shapeType][0]._drawType;
          }
        }
        // To activate/de-activate select tool, based on current draw type
        this._changeSelectToolState();
      },
      _createDrawingToolbar: function () {

        if (this.config.editor.hasOwnProperty("displayShapeSelector")) {
          // check the "createNewFeaturesFromExisting" property for backward compatibility
          if (this.config.editor.displayShapeSelector === true ||
            (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") &&
              (this.config.editor.createNewFeaturesFromExisting === true))) {
            this._menus = this._createDrawingMenus();
            this.drawingTool = new DropDownButton({
              label: "",
              name: "drawingTool",
              id: "drawingTool"
            }, this.drawingOptionsDiv);
            this.drawingTool.startup();
            // check the "createNewFeaturesFromExisting" property for backward compatibility
            if ((this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") &&
              (this.config.editor.createNewFeaturesFromExisting === true))) {
              this._initializeSelectToolWidget();
            }
            this._setDrawingToolbar("select", null);
          }
        }
        else {
          this.config.editor.displayShapeSelector = false;
          // check the "createNewFeaturesFromExisting" property for backward compatibility
          if (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting")) {
            this.config.editor.createNewFeaturesFromExisting = false;
          }
        }
      },
      _createMenu: function (drawingOption) {
        var menu = new DropDownMenu({
          style: "display: none;"
        });
        array.forEach(drawingOption, function (options) {
          var addOption;
          //if displayShapeSelector is disabled & copyFeatures is true show only two options
          //else display all options in ShapeSelector and add copyFeatures option if it is true
          // check the "createNewFeaturesFromExisting" property for backward compatibility
          if ((!this.config.editor.displayShapeSelector) &&
            this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") &&
            this.config.editor.createNewFeaturesFromExisting) {
            addOption = false;
            if ((options.hasOwnProperty("_drawType") && options._drawType === "SELECT") ||
              options.id === "seNewSelection" || options.id === "sePointTool" ||
              options.id === "seDrawPolyline" || options.id === "seDrawPolygon") {
              addOption = true;
            }
          } else {
            addOption = true;
            // check the "createNewFeaturesFromExisting" property for backward compatibility
            if ((options.hasOwnProperty("_drawType") && options._drawType === "SELECT")) {
              if (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") && this.config.editor.createNewFeaturesFromExisting) {
                addOption = true;
              } else {
                addOption = false;
              }
            }
          }
          if (addOption) {
            this._addMenuItem(options, menu, drawingOption);
          }
        }, this);
        menu.startup();
        return menu;
      },
      _createDrawingMenus: function () {
        var menus = {};
        for (var property in SEDrawingOptions) {
          menus[property] = this._createMenu(SEDrawingOptions[property]);
        }
        return menus;
      },
      _createEditor: function () {
        var selectedTemplate = null;

        if (this.config.editor === undefined || this.config.editor === null) {
          return;
        }
        var layers = this._getEditableLayers(this.config.editor.configInfos, false);
        //CT: Commented the code as it was clearing parent features selection when moving to related feature
        //this._layerChangeOutside();
        if (layers.length < 1) {
          this._creationDisabledOnAll = true;
          if (this.currentLayerInfo &&
            !this.currentLayerInfo.isCache && this._attrInspIsCurrentlyDisplayed &&
            this._attrInspIsCurrentlyDisplayed === true) {
            this.attrInspector.refresh();
            this.attrInspector.first();
          }
        } else if (this._templatePickerNeedsToBeCreated()) {
          if (this._attrInspIsCurrentlyDisplayed && this._attrInspIsCurrentlyDisplayed === true) {
            this._recreateOnNextShow = true;
            //AI should be refreshed only when user is working with existing features
            if (!this.currentLayerInfo.isCache) {
              this.attrInspector.refresh();
              this.attrInspector.first();
            }
            return;
          }
          if (this.templatePicker &&
            this.templatePicker !== null) {
            //Get the current selected drawing tool to reset on template
            var curSelectedDrawOption = this.currentDrawType;
            selectedTemplate = this.templatePicker.getSelected();
            if (selectedTemplate === null) {
              if (this.drawToolbar) {

                this.drawToolbar.deactivate();
              }
            }
            this._select_change_event.remove();
            this.templatePicker.destroy();
            this._resetEditingVariables();
            if (this.drawToolbar) {
              this.drawToolbar.deactivate();
            }
            if (this.drawingTool) {
              this._setDrawingToolbar("select", null);
            }
          }
          else {
            this._createAutoSaveSwitch(this.config.editor.autoSaveEdits);
          }
          //create template picker
          this.templatePickerNode = domConstruct.create("div",
            { 'class': "eeTemplatePicker" }
          );
          //if (this.state === "active") {
          //  this.widgetActiveIndicator = domConstruct.create("div",
          //   { 'class': "widgetActive" }
          //   );
          //}
          //else {
          //  this.widgetActiveIndicator = domConstruct.create("div",
          //  { 'class': "widgetNotActive" }
          //  );
          //}
          this.templatePickerDiv.appendChild(this.templatePickerNode);
          this.templatePicker = new TemplatePicker({
            featureLayers: layers,
            'class': 'esriTemplatePicker',
            grouping: true,
            maxLabelLength: "25",
            showTooltip: false
          }, this.templatePickerNode);
          this.templatePicker.startup();
          domAttr.set(this.templatePicker.domNode, "tabindex", "-1");
          aspect.after(this.templatePicker, "update", lang.hitch(this, function () {
            //as soon as update is called, some checkboc node is getting active in template picker
            //hence call this function to remove those checkbox from flow
            this._handle508AccessibilityForTemplatePicker();
            //also after update is called after some time new nodes are added also remove them from flow
            setTimeout(lang.hitch(this, function () {
              this._handle508AccessibilityForTemplatePicker();
            }), 2000);
          }));
          this._addFilterEditor(layers);
          // wire up events

          if (selectedTemplate !== null && this.templatePicker) {
            var keysArr = Object.getOwnPropertyNames(this.templatePicker._itemWidgets);
            var templateItems = [];
            array.forEach(this.templatePicker._flItems, function (flItems) {
              array.forEach(flItems, function (flItem) {
                templateItems.push(flItem);
              });
            });
            if (templateItems.length === keysArr.length) {
              var itemFnd = array.some(templateItems, function (item, index) {
                if (selectedTemplate.featureLayer.id === item.layer.id &&
                  item.template.name === selectedTemplate.template.name &&
                  item.template.drawingTool === selectedTemplate.template.drawingTool &&
                  item.template.description === selectedTemplate.template.description &&
                  item.type === selectedTemplate.type) {
                  var dom = dojo.byId(keysArr[index]);
                  on.emit(dom, "click", {
                    bubbles: true,
                    cancelable: true
                  });
                  this._activateTemplateToolbar(curSelectedDrawOption);
                  return true;
                }
              }, this);

              if (itemFnd === false) {
                if (this.drawToolbar) {
                  this.drawToolbar.deactivate();
                }
                if (this.drawingTool) {
                  this._setDrawingToolbar("select", null);
                }
              }
            }
            else {
              if (this.drawToolbar) {
                this.drawToolbar.deactivate();
              }
              if (this.drawingTool) {
                this._setDrawingToolbar("select", null);
              }
            }
          }
          else {
            if (this.drawToolbar) {
              this.drawToolbar.deactivate();
            }
            if (this.drawingTool) {
              this._setDrawingToolbar("select", null);
            }
          }
          this._select_change_event = on(this.templatePicker, "selection-change",
            lang.hitch(this, this._template_change));
          this.own(this._select_change_event);
        }
        if (layers.length < 1) {
          this._creationDisabledOnAll = true;
        }
        else {
          this._creationDisabledOnAll = false;
        }
        if (this._creationDisabledOnAll) {
          if (this.drawToolbar) {
            this.drawToolbar.deactivate();
          }
          if (this.drawingTool) {
            this._setDrawingToolbar("select", null);
          }
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "none");
            if (this.config.editor.autoSaveEdits) {
              this._createAutoSaveSwitch(false);
            }
            //Clear the selected template and activate the map click
            this._mapClickHandler(true);
            this.templatePicker.clearSelection();

          }
          if (this.drawingTool) {
            dojo.style(this.drawingTool.domNode, "display", "none");
          }
          if (this._filterEditor) {
            dojo.style(this._filterEditor.domNode, "display", "none");
          }
        } else {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "block");
          }
          if (this.config.editor.autoSaveEdits) {
            this._createAutoSaveSwitch(true);
          }
          if (this.drawingTool) {
            dojo.style(this.drawingTool.domNode, "display", "block");
          }
          if (this._filterEditor) {
            dojo.style(this._filterEditor.domNode, "display", "block");
          }
        }
        //if valid config infos create preset table
        if (this.config.editor.configInfos && !this._isPresetTableCreated) {
          //change the value of the variable. This will make sure table is created only once
          this._isPresetTableCreated = true;
          this._createPresetTable(this.config.editor.configInfos);
        }
        //After template picker is created after some time
        //new nodes are added so remove them from flow
        setTimeout(lang.hitch(this, function () {
          this._handle508AccessibilityForTemplatePicker();
        }), 2000);
      },

      /**
    * Code to handle the 508 accessibility features in template picker
    * @memberOf widgets/CostAnalysis/Widget
    */
      _handle508AccessibilityForTemplatePicker: function () {
        var templatePickerGrid, checkBoxNodes, gridLastFocusNode;
        templatePickerGrid = query("div[role='grid']", this.templatePickerDiv);
        checkBoxNodes = query("[type='checkbox']", this.templatePickerDiv);
        gridLastFocusNode = query("[dojoattachpoint='lastFocusNode']",
          this.templatePickerDiv);
        //Check for all the elements before changing the tab indexes to "-1"
        if (templatePickerGrid && templatePickerGrid[0]) {
          domAttr.set(templatePickerGrid[0], "tabindex", "-1");
        }
        array.forEach(checkBoxNodes, lang.hitch(this, function (node) {
          domAttr.set(node, "tabindex", "-1");
        }));
        //Change the tab index of grid's last focus node to "-1"
        if (gridLastFocusNode && gridLastFocusNode[0]) {
          domAttr.set(gridLastFocusNode[0], "tabindex", "-1");
        }
        var gridMsg = query(".dojoxGridMasterMessages", this.domNode);
        if (gridMsg && gridMsg.length > 0) {
          domAttr.set(gridMsg[0], "tabindex", "-1");
        }
      },

      isGuid: function (value) {
        if (value[0] === "{") {
          value = value.substring(1, value.length - 1);
        }
        var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(value);
      },
      _template_change: function () {
        this._deactivateAllTools();
        this.currentDrawType = null;
        this.currentShapeType = null;
        this._activateTemplateToolbar();
      },
      validateGUID: function (value, constraints) {
        constraints = constraints;
        return this.isGuid(value);
      },
      _createPresetTable: function (layerInfos) {
        //to support backward compatibility
        //if canPresetValue flag is present and it is set to true update the layer infos accordingly
        this._processConfigForBackwardPresetInfos(layerInfos);
        if (this.config.hasOwnProperty("attributeActionGroups") &&
          Object.keys(this.config.attributeActionGroups.Preset).length > 0) {
          // set preset values table
          this._initPresetFieldsTable(layerInfos);
          if (this.templatePicker) {
            query(".presetFieldsTableDiv")[0].style.display = "block";
          } else {
            query(".presetFieldsTableDiv")[0].style.display = "none";
          }
        }
      },

      _processConfigForBackwardPresetInfos: function (layerInfos) {
        var configuredPresetInfos = [];
        //if preset infos is not available in config means use the preset info for canPresetValue
        //flag stored in filed infos
        if (!this.config.editor.hasOwnProperty("presetInfos") && layerInfos) {
          array.forEach(layerInfos, lang.hitch(this, function (configInfo) {
            configInfo.fieldValues = {};
            array.forEach(configInfo.fieldInfos, lang.hitch(this, function (fieldInfo) {
              var actionObj;
              //Check for "canPresetValue" key and handle it for backward compatibility
              if (fieldInfo.hasOwnProperty("canPresetValue") && fieldInfo.canPresetValue) {
                actionObj = [{
                  "actionName": "Intersection",
                  "enabled": false
                }, {
                  "actionName": "Address",
                  "enabled": false
                }, {
                  "actionName": "Coordinates",
                  "enabled": false
                }, {
                  "actionName": "Preset",
                  "enabled": true
                }];
                configInfo.fieldValues[fieldInfo.fieldName] = lang.clone(actionObj);
                configuredPresetInfos[fieldInfo.fieldName] = [];
              }
            }));
          }));
          this.config.editor.presetInfos = configuredPresetInfos;
        }
        //Backward compatibility for the apps configured before 2.14 WAB
        //Update the preset based on fields to Preset Builder Groups
        presetBuilderBackwardCompatibility.createPresetGroups(this.config, this._jimuLayerInfos);
      },

      _presetChange: function () {
        this._toggleUsePresetValues(true);
      },
      _createAutoSaveSwitch: function (defaultState) {
        if (defaultState) {
          query(".autoSaveOptionDiv")[0].style.display = "block";
        } else {
          query(".autoSaveOptionDiv")[0].style.display = "none";
        }
      },
      _toggleRunTimeAutoSave: function () {
        if (this._autoSaveRuntime === false) {
          this._autoSaveRuntime = true;
        } else {
          this._autoSaveRuntime = false;
        }
        this._createAutoSaveSwitch(this.config.editor.autoSaveEdits);
      },
      _deleteFeature: function () {
        if (!this.currentFeature) { return; }

        this._resetEditingVariables();

        var layer = this.currentFeature.getLayer();
        if (layer.url === null) {
          layer.clear();
          this._showTemplate(true);

        } else {
          var processIndicators = query(".processing-indicator");
          var processIndicatorsPanel = query(".processing-indicator-panel");
          var saveBtn = query(".saveButton", this.buttonHeader)[0];
          array.forEach(processIndicators, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          array.forEach(processIndicatorsPanel, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          if (!domClass.contains(saveBtn, "hide")) {
            domClass.add(saveBtn, "hide");
          }

          layer.applyEdits(null, null, [this.currentFeature],
            lang.hitch(this, function (adds, updates, deletes) {
              adds = adds;
              updates = updates;
              if (deletes && deletes.length > 0 && deletes[0].hasOwnProperty("error")) {
                Message({
                  message: deletes[0].error.toString()
                });

              }
              else {
                this.updateFeatures.splice(this.updateFeatures.indexOf(this.currentFeature), 1);
                //after delete if features length is greater than 0
                //then refresh attribute inspector & show next feature else
                //if showing features of related layer and
                if (this.updateFeatures && this.updateFeatures.length > 0) {
                  //In case of deleting features from table the selection does not updates,
                  //although we removed it from updateFeatures Array.
                  //So again select records with remaining oIds
                  if (layer.type === "Table") {
                    var oIds = [];
                    this.loading.show();
                    array.forEach(this.updateFeatures, function (feature) {
                      oIds.push(feature.attributes[layer.objectIdField]);
                    });
                    var query = new Query();
                    query.objectIds = oIds;
                    layer.selectFeatures(query, FeatureLayer.SELECTION_NEW,
                      lang.hitch(this, function (selectedFeatures) {
                        this.updateFeatures = selectedFeatures;
                        this.attrInspector.refresh();
                        this.attrInspector.first();
                        this.loading.hide();
                      }), lang.hitch(this, function () {
                        this.loading.hide();
                      }));
                  } else {
                    this.attrInspector.refresh();
                    this.attrInspector.first();
                  }

                } else {
                  //show template picker if showing details of layer
                  //& when showing related tables/layers details go back to parent features details
                  if (this._traversal.length < 2) {
                    this._showTemplate(true);
                    this._setWidgetFirstFocusNode("templatePicker", true)
                  } else {
                    on.emit(this.cancelButton, 'click', { cancelable: true, bubbles: true });
                    this._setWidgetFirstFocusNode("AI", true)
                  }
                }
              }
              array.forEach(processIndicators, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              array.forEach(processIndicatorsPanel, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              if (domClass.contains(saveBtn, "hide")) {
                domClass.remove(saveBtn, "hide");
              }
            }), lang.hitch(this, function (err) {
              Message({
                message: err.message.toString() + "\n" + err.details
              });
              array.forEach(processIndicators, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              array.forEach(processIndicatorsPanel, function (processIndicator) {
                if (domClass.contains(processIndicator, "busy")) {
                  domClass.remove(processIndicator, "busy");
                }
              });
              if (domClass.contains(saveBtn, "hide")) {
                domClass.remove(saveBtn, "hide");
              }
            }));
        }
      },

      _editGeometry: function (checked) {
        //if current layerInfo dont have editFlag return
        if (checked &&
          (this._ignoreEditGeometryToggle ||
            (this.currentLayerInfo && !this.currentLayerInfo._editFlag))) {
          return;
        }

        if (checked === true) {
          if (this.currentLayerInfo &&
            this.currentLayerInfo.disableGeometryUpdate && !this.currentLayerInfo.isCache) {
            return;
          }
          //When not in create mode and layerAllowsUpdate is false or layer has M 0r Z value
          if (this.currentLayerInfo && !this.currentLayerInfo.isCache &&
            (!this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate ||
              (this.currentLayerInfo.featureLayer.hasZ && !this.currentLayerInfo.featureLayer.enableZDefaults) ||
              (this.currentLayerInfo.featureLayer.hasM && !this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues))) {
            return;
          }
          this.map.setInfoWindowOnClick(false);

          if (this.map.infoWindow.isShowing) {
            this.map.infoWindow.hide();
          }
          //enable editing only if it is disabled & current feature is valid have geometry
          if (this._editingEnabled === false && this.currentFeature && this.currentFeature.geometry) {
            this._editingEnabled = true;
            // store the original geometry for later use
            this.currentFeature.origGeom = this.currentFeature.geometry.toJson();
            this._activateEditToolbar(this.currentFeature);
          } else {
            if (this.editToolbar.getCurrentState().tool !== 0) {
              this.editToolbar.deactivate();
            }
            this._editingEnabled = false;
          }
        } else {
          this.map.setInfoWindowOnClick(true);
          //I am not sure what this is doing, but it causes issue
          //if (this.editToolbar.getCurrentState().tool !== 0) {
          this.editToolbar.deactivate();
          //}
          this._editingEnabled = false;
        }
        this._toggleAttributeButtonVisibility(checked);
        this._toggleLocateButtonVisibility(checked);
        this._toggleXYCoordinatesButtonVisibility(checked);
        this._toggleMapNavigationButtonVisibility(checked);
        this._setWidgetFirstFocusNode("AI", false);
      },

      /**
       * This function is used to toggle the state of attribute button from auto update on to off mode & vice versa
       */
      _toggleAttributeButtonState: function () {
        // replace the state of button from on to off mode, if user clicks on button in auto on mode
        if (this._refreshButton && domClass.contains(this._refreshButton, "esriCTAutoUpdateOnMode")) {
          domClass.replace(this._refreshButton, "esriCTAutoUpdateOffMode", "esriCTAutoUpdateOnMode");
          domAttr.set(this._refreshButton, "title", this.nls.automaticAttributeUpdatesOff);
        } else if (this._refreshButton && domClass.contains(this._refreshButton, "esriCTAutoUpdateOffMode")) {
          domClass.replace(this._refreshButton, "esriCTAutoUpdateOnMode", "esriCTAutoUpdateOffMode");
          domAttr.set(this._refreshButton, "title", this.nls.automaticAttributeUpdatesOn);
          //Since the button is turned on, the updated geometry should be used for fetching attributes
          this._refreshAttributes();
        }
      },

      /**
       * This function is used to show/hide the map navigation button depending upon certain conditions
       * @param {checked} : boolean value consisting a state of the edit geometry checkbox. if checked show the icon else hide it
       */
      _toggleAttributeButtonVisibility: function (checked) {
        // Show/Hide map navigation button based on edit checkbox state
        // and enableLockingMapNavigation configuration
        if (checked && this.config.editor.enableAttributeUpdates) {
          domClass.remove(this._refreshButton, "hidden");
        } else {
          domClass.add(this._refreshButton, "hidden");
        }
      },

      /**
       * This function is used to show/hide the locate button depending upon certain conditions
       * @param {checked} : a state of the edit geometry checkbox. if checked show the icon else hide it
       */
      _toggleLocateButtonVisibility: function (checked) {
        //if edit checkbox is checked and enableMovingSelectedFeatureToGPS is enabled
        //and selected feature is point then show locate button
        if (checked && this.config.editor.enableMovingSelectedFeatureToGPS &&
          this.currentFeature && this.currentFeature.geometry &&
          this.currentFeature.geometry.type === "point") {
          domClass.remove(this._locateButtonDiv, "hidden");
        } else {
          domClass.add(this._locateButtonDiv, "hidden");
        }
      },

      /**
       * This function is used to show/hide the xy coordinates button depending upon certain conditions
       * @param {checked} : a state of the edit geometry checkbox. if checked show the icon else hide it
       */
      _toggleXYCoordinatesButtonVisibility: function (checked) {
        //if edit checkbox is checked and enableMovingSelectedFeatureToXY is enabled
        //and selected feature is point then show xyCoordinates button
        if (checked && this.config.editor.enableMovingSelectedFeatureToXY &&
          this.currentFeature && this.currentFeature.geometry &&
          this.currentFeature.geometry.type === "point") {
          domClass.remove(this._xyCoordinates, "hidden");
        } else {
          domClass.add(this._xyCoordinates, "hidden");
        }
      },

      /**
       * This function is used to invoke the state change of map navigation button
       */
      _toggleMapNavigationButtonState: function () {
        if (domClass.contains(this._mapNavigation, "esriCTMapNavigationUnLocked")) {
          this._lockMapNavigation();
        } else if (domClass.contains(this._mapNavigation, "esriCTMapNavigationLocked")) {
          this._unLockMapNavigation();
        }
      },

      /**
       * This function is used to lock the map navigation
       */
      _lockMapNavigation: function () {
        if (this._mapNavigation) {
          domClass.replace(this._mapNavigation, "esriCTMapNavigationLocked", "esriCTMapNavigationUnLocked");
          domAttr.set(this._mapNavigation, "title", this.nls.mapNavigationLocked);
          this.map.disableMapNavigation();
        }
      },

      /**
       * This function is used to unlock the map navigation
       */
      _unLockMapNavigation: function () {
        if (this._mapNavigation) {
          domClass.replace(this._mapNavigation, "esriCTMapNavigationUnLocked", "esriCTMapNavigationLocked");
          domAttr.set(this._mapNavigation, "title", this.nls.mapNavigationUnLocked);
          this.map.enableMapNavigation();
        }
      },

      /**
       * This function is used to show/hide the map navigation button depending upon certain conditions
       * @param {checked} : boolean value consisting a state of the edit geometry checkbox. if checked show the icon else hide it
       */
      _toggleMapNavigationButtonVisibility: function (checked) {
        // Show/Hide map navigation button based on edit checkbox state
        // and enableLockingMapNavigation configuration
        if (checked && this.config.editor.enableLockingMapNavigation) {
          domClass.remove(this._mapNavigation, "hidden");
        } else {
          domClass.add(this._mapNavigation, "hidden");
        }
        this._unLockMapNavigation();
      },

      _enableAttrInspectorSaveButton: function (enable, isNewRelatedFeature) {
        var saveBtn = query(".saveButton", this.buttonHeader)[0];
        var isSaveButtonEnable = false;
        if (!saveBtn) { return; }

        if (enable) {
          if (domClass.contains(saveBtn, "jimu-state-disabled")) {
            domClass.remove(saveBtn, "jimu-state-disabled");
            domAttr.set(saveBtn, "tabindex", "0");
          }
          isSaveButtonEnable = true;
          domAttr.set(saveBtn, "tabindex", "0");
          this._setWidgetFirstFocusNode("AI", false);
        } else {
          if (!domClass.contains(saveBtn, "jimu-state-disabled")) {
            domClass.add(saveBtn, "jimu-state-disabled");
            domAttr.set(saveBtn, "tabindex", "-1");
            this._setWidgetFirstFocusNode("AI", false);
          }
        }
        //Update the save buttons state in its respective related table info
        if (!isNewRelatedFeature && this.currentFeature &&
          this._relatedTablesInfo[this.currentFeature._layer.id]) {
          this._relatedTablesInfo[this.currentFeature._layer.id].isSaveEnable = isSaveButtonEnable;
        }
      },

      _setConfiguredFieldInfos: function (layerFieldInfo, configuredFieldInfo) {
        var fieldInfos = [];
        array.forEach(configuredFieldInfo, function (field) {
          var fieldInfoFromLayer = presetUtils.getFieldInfoByFieldName(layerFieldInfo, field.fieldName);
          var fInfo = lang.mixin(lang.clone(fieldInfoFromLayer), field);
          fieldInfos.push(fInfo);
        });
        return fieldInfos;
      },

      _getLayerInfoByID: function (id) {
        if (id.indexOf("_lfl") > 0) {
          id = id.replace("_lfl", "");
        }
        //if user is seeing related tables details get it from relationShip info
        //else  get the details from layerInfos directly
        if (this._traversal && this._traversal.length > 0) {
          var currentConfig;
          currentConfig = this.config.editor.configInfos;
          //Loop through all configured layers and
          //traverse to the selected layer / table by using traversal lineage & returns layerInfo
          array.some(this._traversal, function (layerId, layerIndex) {
            array.some(currentConfig, function (info) {
              if (info.featureLayer.id === layerId) {
                currentConfig = info;
                return true;
              }
            });
            //if current table is not of all-layers and the index is not last then consider the next relations
            if (this._traversal.length > 1 && layerIndex + 1 < this._traversal.length) {
              currentConfig = currentConfig.relationshipInfos;
            }

          }, this);
          //layer info will not be available for related layer infos so add it
          if (!currentConfig.layerInfo) {
            currentConfig.layerInfo = this._jimuLayerInfos.getLayerOrTableInfoById(currentConfig.featureLayer.id);
            //get layers configFeatureLayer info
            var layerConfig = editUtils.getConfigInfo(currentConfig.layerInfo, {});
            var layerObject = currentConfig.layerInfo.layerObject;
            // modify templates with space in string fields
            this._removeSpacesInLayerTemplates(layerObject);
            //set configured field with the detailed field info from layers fieldInfos
            currentConfig.fieldInfos = this._setConfiguredFieldInfos(layerConfig.fieldInfos, currentConfig.fieldInfos);
            this.processConfigForRuntime(currentConfig);
            currentConfig.configFeatureLayer = layerConfig.featureLayer;
            currentConfig.featureLayer = layerObject;
            currentConfig.showDeleteButton = false;
          }
          return currentConfig;
        } else {
          var result = null;
          this.config.editor.configInfos.some(function (configInfo) {
            return configInfo.featureLayer.id === id ? ((result = configInfo), true) : false;
          });
          return result;
        }
      },

      _initPresetFieldsTable: function (editLayerInfos) {
        var presetValueTableNode = domConstruct.create("div", {
          "class": "ee-presetValueTableDiv templatePicker"
        }, this.presetFieldsTableNode);
        var bodyDiv = domConstruct.create("div", { "class": "bodyDiv" }, presetValueTableNode);
        var bodyTable = domConstruct.create("table", { "class": "ee-presetValueBodyTable" }, bodyDiv);

        var presetValueTable = domConstruct.create("tbody", {
          "class": "ee-presetValueBody", "id": "eePresetValueBody"
        }, bodyTable, "first");

        var presetAllFields = new PresetAllFields({
          nls: this.nls,
          parentNode: presetValueTable,
          configInfos: editLayerInfos,
          _jimuLayerInfos: this._jimuLayerInfos,
          _configuredPresetInfos: this.config.attributeActionGroups.Preset,
          showingInWidget: true
        });
        this.own(on(presetAllFields, "presetValueChanged", lang.hitch(this, this._presetChange)));
        //Hide Preset form borders when all groups are set to hide in display
        if (!presetAllFields.hasAtLeastOneGroupInDisplay) {
          domClass.add(presetValueTableNode, "esriCTHidden");
        }
        //enable use preset value checkbox if any of the preset group has valid value
        if (presetAllFields.enableUsePresetValueCheckBox) {
          this._presetChange();
        }
      },

      _dateClick: function (dateWidget, timeWidget) {
        return function () {
          if (dateWidget !== undefined && dateWidget !== null) {
            dateWidget.set('value', new Date());
          }
          if (timeWidget !== undefined && timeWidget !== null) {
            timeWidget.set('value', new Date());
          }
        };

      },
      _getEditableLayers: function (layerInfos, allLayers) {
        var layers = [];
        array.forEach(layerInfos, function (layerInfo) {
          if (layerInfo._editFlag) {
            if (!layerInfo.allowUpdateOnly || allLayers) { //
              var layerObject = this.map.getLayer(layerInfo.featureLayer.id);
              if (layerObject &&
                layerObject.visible &&
                layerObject.isVisibleAtScale(this.map.getScale()) &&
                layerObject.isEditable &&
                layerObject.isEditable()) {
                layers.push(layerObject);
              }
            }
          }
        }, this);

        return layers;
      },
      _getEditableLayersInfos: function (layerInfos, allLayers) {
        var layers = [];
        array.forEach(layerInfos, function (layerInfo) {
          if (layerInfo._editFlag) {
            if (!layerInfo.allowUpdateOnly || allLayers) { //
              var layerObject = this.map.getLayer(layerInfo.featureLayer.id);
              if (layerObject &&
                layerObject.visible &&
                layerObject.isVisibleAtScale(this.map.getScale()) &&
                layerObject.isEditable &&
                layerObject.isEditable()) {
                layers.push(layerInfo);
              }
            }
          }
        }, this);

        return layers;
      },
      _getClonedRelationInfo: function (relations) {
        var newRelations = [];
        for (var i = 0; i < relations.length; i++) {
          var relatedInfo = {};
          for (var key in relations[i]) {
            if (relations[i].hasOwnProperty(key) && key !== 'featureLayer' && key !== 'layerInfo') {
              //Get recursive relationship info's
              if (key === "relationshipInfos") {
                relatedInfo[key] = this._getClonedRelationInfo(relations[i][key]);
              } else {
                relatedInfo[key] = lang.clone(relations[i][key]);
              }
            }
          }
          newRelations.push(relatedInfo);
        }
        return newRelations;
      },
      _getLayerInfoForLocalLayer: function (localLayer) {

        var result = this._getLayerInfoByID(localLayer.originalLayerId);
        var layerInfo;

        if (result !== null) {//(layerObject.type === "Feature Layer" && layerObject.url) {
          // get the fieldInfos
          layerInfo = {};
          for (var k in result) {
            if (result.hasOwnProperty(k) && k !== 'featureLayer' && k !== 'layerInfo') {
              if (k === "relationshipInfos") {
                layerInfo[k] = this._getClonedRelationInfo(result[k]);
              } else {
                layerInfo[k] = lang.clone(result[k]);
              }
            }
          }

          layerInfo.featureLayer = localLayer;

        }
        return layerInfo;
      },
      _getSelectionSymbol: function (geometryType, highlight) {
        if (!geometryType || geometryType === "") { return null; }

        var selectionSymbol;
        switch (geometryType) {
          case "esriGeometryPoint":
            if (highlight === true) {
              selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                20,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  new Color([0, 230, 169, 1]), 2),
                new Color([0, 230, 169, 0.65]));
            } else {
              selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                20,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  new Color([92, 92, 92, 1]), 2),
                new Color([255, 255, 0, 0.65]));
            }
            break;
          case "esriGeometryPolyline":
            if (highlight === true) {
              selectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 255, 255, 0.65]), 2);
            } else {
              selectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 255, 0, 0.65]), 2);
            }
            break;
          case "esriGeometryPolygon":
            var line;
            if (highlight === true) {
              selectionSymbol = new SimpleFillSymbol().setColor(new Color([0, 230, 169, 0.65]));
              line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([192, 192, 192, 1]), 2);
            } else { // yellow with black outline
              selectionSymbol = new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.65]));
              line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([192, 192, 192, 1]), 2);
            }
            selectionSymbol.setOutline(line);
            break;
        }
        return selectionSymbol;
      },
      _hasPresetValueFields: function (layerInfos) {
        return layerInfos.some(function (layerInfo) {
          if (layerInfo.allowUpdateOnly === false) {
            if (layerInfo.fieldInfos) {
              return layerInfo.fieldInfos.some(function (fi) {
                return fi.canPresetValue === true;
              });
            }
            else {
              return false;
            }
          }
          else {
            return false;
          }
        }, this);

      },

      _setPresetValueValue: function (fieldName, value, groupName) {
        var createGroupName = true;
        var presetValueTable = query("#eePresetValueBody")[0];
        if (groupName) {
          createGroupName = false;
        }
        if (presetValueTable) {
          var inputElements = query(".preset-value-editable .ee-inputField");
          array.forEach(inputElements, lang.hitch(this, function (ele) {
            var elem = dijit.byNode(ele);
            if (elem !== undefined && elem !== null) {
              //Get element namd and dategroup info
              var elementName = elem.get("name");
              var isDateGroup = elem.get("isdategroup");
              var spaceSeperatedGroupName;
              //For backward compatibility, create group name using fieldName
              //for e.g Prest gorup will have groupName 'Name (name)'
              //in this only match field name in brackets
              if (createGroupName) {
                spaceSeperatedGroupName = elementName.split(" ");
                if (spaceSeperatedGroupName.length > 1) {
                  elementName = spaceSeperatedGroupName[1];
                  groupName = "(" + fieldName + ")";
                }
              }
              //If group name is valid and it matches elements name then set the value
              if (groupName && elementName.toLowerCase() === groupName.toLowerCase()) {
                //In case of date groups create fixed date info
                //else set the value directly
                if (elem.esriCTisDateGroup) {
                  var dateInfo = {
                    "dateType": "fixed",
                    "dateTime": new Date(value).getTime()
                  }
                  elem.esriCTPresetGroup.presetValue = dateInfo;
                  //If valid date exist, show the same in preset group
                  if (dateInfo.dateTime) {
                    elem.set("value",
                      presetUtils.getDateFromRelativeInfo(elem.esriCTPresetGroup.presetValue, true));
                  } else {
                    //Otherwise show the empty date
                    elem.set("value", "");
                  }
                } else if (elem.esriCTDomainList) {
                  array.some(elem.store.data, function (option) {
                    if (option.id === value) {
                      elem.set("value", value);
                      return true;
                    }
                  });
                } else {
                  elem.set("value", value);
                }
              }
            }
          }));
        }
      },

      _modifyAttributesWithPresetValues: function (attributes, newTempLayerInfos, copyAttrInfo, fKeyField) {
        var presetFields = [], presetFieldsGroupName = {}, uniquePresetGroupNames = [];
        //if fieldValues exist means copy actions are applied
        if (newTempLayerInfos.fieldValues) {
          //loop through all copy actions and get the values as per priority for individual actions
          for (var fieldName in newTempLayerInfos.fieldValues) {
            for (var i = 0; i < newTempLayerInfos.fieldValues[fieldName].length; i++) {
              var copyAction = newTempLayerInfos.fieldValues[fieldName][i];
              var foundInIntersection = false;
              var currentFieldInfo;
              //get current feields info
              if (newTempLayerInfos.fieldInfos) {
                currentFieldInfo = presetUtils.getFieldInfoByFieldName(newTempLayerInfos.fieldInfos, fieldName);
              }
              //get value form intersection if it is enabled
              if (copyAttrInfo && copyAction.actionName === "Intersection" && copyAction.enabled) {
                for (var j = 0; j < copyAction.fields.length; j++) {
                  var fieldInfo = copyAction.fields[j];
                  if (copyAttrInfo.Intersection.hasOwnProperty(fieldName) &&
                    copyAttrInfo.Intersection[fieldName].hasOwnProperty(fieldInfo.layerId) &&
                    copyAttrInfo.Intersection[fieldName][fieldInfo.layerId].hasOwnProperty(fieldInfo.field)) {
                    attributes[fieldName] = copyAttrInfo.Intersection[fieldName][fieldInfo.layerId][fieldInfo.field];
                    foundInIntersection = true;
                    break;
                  }
                }
                if (foundInIntersection) {
                  break;
                }
              }
              //get value from address if it is enabled
              if (copyAttrInfo && copyAction.actionName === "Address" && copyAction.enabled &&
                copyAttrInfo.Address.hasOwnProperty(copyAction.field)) {
                attributes[fieldName] = copyAttrInfo.Address[copyAction.field];
                break;
              }
              //get value from coordinates if it is enabled
              if (copyAttrInfo && copyAction.actionName === "Coordinates" && copyAction.enabled) {
                //If xy is a field store both x y in same field
                if (copyAction.field === "xy") {
                  attributes[fieldName] = copyAttrInfo.Coordinates[copyAction.coordinatesSystem].x + " " +
                    copyAttrInfo.Coordinates[copyAction.coordinatesSystem].y;
                } else {
                  attributes[fieldName] = copyAttrInfo.Coordinates[copyAction.coordinatesSystem][copyAction.field];
                  //when x/y coordinates are used and control is changed to textarea, it is showing invalid in text area.
                  //so convert value to string if the field type is string
                  if (currentFieldInfo && currentFieldInfo.type === "esriFieldTypeString") {
                    attributes[fieldName] = attributes[fieldName].toString();
                  }
                }
                break;
              }
              //get value from preset if it is enabled
              //Skip forieng key field to be overridden by attribute actions
              if (!fKeyField || fKeyField !== fieldName) {
                if (copyAction.actionName === "Preset" && copyAction.enabled && this._usePresetValues) {
                  presetFields.push(fieldName);
                  if (copyAction.attributeActionGroupName) {
                    presetFieldsGroupName[fieldName] = copyAction.attributeActionGroupName;
                    if (uniquePresetGroupNames.indexOf(copyAction.attributeActionGroupName) < 0) {
                      uniquePresetGroupNames.push(copyAction.attributeActionGroupName);
                    }
                  }
                  break;
                }
              }
            }
          }
        }
        //if preset is configured for some fields
        //then modify Attributes with preset values entered in the preset form
        if (presetFields.length > 0) {
          var valToSet = this._getPresetValueForGroup(uniquePresetGroupNames);
          for (var attribute in attributes) {
            if (attributes.hasOwnProperty(attribute) &&
              presetFields.indexOf(attribute) >= 0 &&
              presetFieldsGroupName.hasOwnProperty(attribute)) {
              attributes[attribute] = valToSet[presetFieldsGroupName[attribute]];
            }
          }
        }
      },

      /**
       * Returns object with groupName and its value
       * @param {Array of group names for which values need to be fetched} groupNames
       */
      _getPresetValueForGroup: function (groupNames) {
        var returnValue = {};
        var configuredPresetGroups = this.config.attributeActionGroups.Preset;
        for (var i = 0; i < groupNames.length; i++) {
          //Check if preset group name exist
          if (configuredPresetGroups.hasOwnProperty(groupNames[i])) {
            var presetGroup = configuredPresetGroups[groupNames[i]];
            if (!presetGroup.showOnlyDomainFields &&
              (presetGroup.dataType === "esriFieldTypeString" ||
                presetGroup.dataType === "esriFieldTypeInteger" ||
                presetGroup.dataType === "esriFieldTypeGUID")) {
              returnValue[groupNames[i]] = presetGroup.presetValue;
            } else if (presetGroup.dataType === "esriFieldTypeDate" &&
              !presetGroup.showOnlyDomainFields) {
              //get date from relative info stored
              var newFieldVal = presetUtils.getDateFromRelativeInfo(presetGroup.presetValue);
              //get date in epoch format so that it can be saved in the layer
              newFieldVal = (newFieldVal && newFieldVal.getTime) ?
                newFieldVal.getTime() : (newFieldVal && newFieldVal.toGregorian ?
                  newFieldVal.toGregorian().getTime() : newFieldVal);
              //store new date value in object
              returnValue[groupNames[i]] = newFieldVal;
            } else if (presetGroup.selectedDomainValue) {
              returnValue[groupNames[i]] = presetGroup.selectedDomainValue;
            }
          }
        }
        return returnValue;
      },

      // to add (*) to the label of required fields
      // also add field type and domain to use in the preset values
      processConfigForRuntime: function (configInfo) {

        if (!configInfo) {
          return;
        }
        //if layer is not editable set editable flag to false
        //so that attribute inspector will open in disabled mode
        if (!configInfo._editFlag) {
          configInfo.isEditable = false;
        }
        configInfo.fieldInfos = array.filter(configInfo.fieldInfos, function (fieldInfo) {
          if (fieldInfo.type === "esriFieldTypeBlob" ||
            fieldInfo.type === "esriFieldTypeGlobalID" ||
            fieldInfo.type === "esriFieldTypeRaster" ||
            fieldInfo.type === "esriFieldTypeXML") {//fieldInfo.type === "esriFieldTypeGeometry" || fieldInfo.type === "esriFieldTypeOID" ||
            return false;
          }
          if (fieldInfo.nullable === false && fieldInfo.editable === true) {
            //Removed for JS api 3.20 as this is part of the Attribute Inspector
            //if (fieldInfo.label.indexOf('<a class="asteriskIndicator">') < 0) {
            //  fieldInfo.label = fieldInfo.label +
            //    '<a class="asteriskIndicator"> *</a>';
            //}
          }
          if (fieldInfo.isEditable === true) {
            return true;
          }
          else {
            return fieldInfo.visible;
          }
        });
      },

      _newAttrInspectorNeeded: function () {
        var yes = false;

        if (!this.attrInspector || this.attrInspector.layerInfos.length > 1) {
          yes = true;
        } else { //this.attrInspector.layerInfos.length == 1

          var lflId = this.attrInspector.layerInfos[0].featureLayer.id;
          if (lflId.indexOf("_lfl") > 0) { // attrInspector associated with a local feature
            yes = lflId.indexOf(this.templatePicker.getSelected().featureLayer.id) < 0;
          } else {

            yes = true;
          }
        }

        if (yes && this.attrInspector) {
          this.attrInspector.destroy();
          this.attrInspector = null;
        }
        else {
          if (this._attachmentUploader && this._attachmentUploader !== null) {
            this._attachmentUploader.clear();
          }
        }
        return yes;
      },

      _onMapClick: function (evt) {
        // It is used to clear all the highlighted features which were highlighted
        // using custom select tool. This is executed when user clicks on map.
        if (this._copyFeaturesObj) {
          // Consider a case when user is viewing copy features list and clicks on map.
          // At this stage, since that features needs to be selected, template picker should be cleared which
          // is needed for de-activating select tool.
          if (this.templatePicker) {
            this.templatePicker.clearSelection();
          }
          this._copyFeaturesObj.cancelBtnClicked();
        }
        if (this._byPass && this._byPass === true) {
          this._byPass = false;
          return;
        }
        var hasTemplate = false;
        if (this.templatePicker) {
          hasTemplate = this.templatePicker.getSelected() ? true : false;
        }
        if (!this._attrInspIsCurrentlyDisplayed &&
          evt.mapPoint &&
          hasTemplate === false) {
          this._processOnMapClick(evt);
        }
      },
      _attachmentsComplete: function (featureLayer, oid, deferred) {
        return function (results) {
          var errorMsg = "";
          array.forEach(results, function (result) {
            if (result) {
              if (result.state === "rejected") {
                if (result.error && esriLang.isDefined(result.error.code)) {
                  if (result.error.code === 400) {
                    // 400 is returned for unsupported attachment file types
                    errorMsg = errorMsg +
                      esriBundle.widgets.attachmentEditor.NLS_fileNotSupported + "<br/>";
                  } else {
                    errorMsg = errorMsg + result.error.message ||
                      (result.error.details &&
                        result.error.details.length &&
                        result.error.details[0]) + "<br/>";
                  }

                }
              }
            }
          }, this);
          if (errorMsg !== "") {
            var dialog = new Popup({
              titleLabel: this.nls.attachmentLoadingError,
              width: 400,
              maxHeight: 200,
              autoHeight: true,
              content: errorMsg,
              buttons: [{
                label: this.nls.back,
                classNames: ['jimu-btn'],
                onClick: lang.hitch(this, function () {
                  dialog.close();
                })
              }],
              onClose: lang.hitch(this, function () {

              })
            });
          }
          return this._completePost(featureLayer, oid, deferred);
        };

      },
      _selectComplete: function (featureLayer, deferred) {
        return function () {
          this._removeLocalLayers();
          this.currentFeature = null;
          this._showTemplate(false);
          deferred.resolve("success");
        };
      },
      _completePost: function (featureLayer, oid, deferred) {
        this._createAttributeInspector([this.currentLayerInfo]);
        var query = new Query();
        query.objectIds = [oid];
        featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW,
          lang.hitch(this, this._selectComplete(featureLayer, deferred)),
          lang.hitch(this, function () {
            deferred.resolve("failed");
          })
        );
      },
      // posts the currentFeature's changes
      _postChanges: function (feature) {

        var deferred = new Deferred();

        var result = this._changed_feature(feature, false);
        var returnFeature = result[0];
        var layerId = result[1];
        var type = result[2];
        var layer = null;
        var postDef = null;
        if (returnFeature === null) {
          deferred.resolve("success");
        }
        else if (type === "Add") {
          if (this._traversal.length > 1) {
            this.addNewRelatedRecord = true;
          }
          //Get layer or table info as now user can update related records/features
          layer = this._jimuLayerInfos.getLayerOrTableInfoById(layerId).layerObject;
          postDef = layer.applyEdits([returnFeature], null, null);
          this.addDeferred(postDef, returnFeature, layer, deferred);
        }
        else {
          //Get layer or table info as now user can update related records/features
          layer = this._jimuLayerInfos.getLayerOrTableInfoById(layerId).layerObject;
          if (Object.keys(returnFeature.attributes).length === 0 &&
            returnFeature.geometry === null) {
            deferred.resolve("success");
          }
          else if (Object.keys(returnFeature.attributes).length === 1 &&
            returnFeature.attributes.hasOwnProperty(layer.objectIdField) &&
            returnFeature.geometry === null) {
            //check to see if the only field is the OID, if so, skip saving
            deferred.resolve("success");
          }
          else {
            postDef = layer.applyEdits(null, [returnFeature], null);
            this.addDeferred(postDef, returnFeature, layer, deferred);
          }
        }
        return deferred.promise;
      },
      _changed_feature: function (feature, removeOIDField) {
        var returnFeature = null;
        var type = null;
        var featureLayer = null;
        var featureLayerId = null;
        removeOIDField = removeOIDField || false;
        var ruleInfo;
        var k = null;
        if (feature) {
          returnFeature = new Graphic(null, null, JSON.parse(JSON.stringify(feature.attributes)));

          if (this._smartAttributes !== undefined && this._smartAttributes !== null) {
            for (k in returnFeature.attributes) {
              if (returnFeature.attributes.hasOwnProperty(k) === true) {
                ruleInfo = this._smartAttributes.validateField(k);
                if (ruleInfo[1] === 'Hide' && ruleInfo[3] !== true) {
                  delete returnFeature.attributes[k];
                }
              }
            }
          }
          for (k in returnFeature.attributes) {
            if (returnFeature.attributes.hasOwnProperty(k) === true) {
              if (returnFeature.attributes[k] === "") {
                returnFeature.attributes[k] = null;
              }
            }
          }
          if (this._attributeInspectorTools) {
            returnFeature.attributes = this._attributeInspectorTools._checkFeatureData(returnFeature.attributes);
            if (feature.preEditAttrs) {
              returnFeature.preEditAttrs =
                this._attributeInspectorTools._checkFeatureData(JSON.parse(JSON.stringify(feature.preEditAttrs)));
            }
          }
          else {
            if (feature.preEditAttrs) {
              returnFeature.preEditAttrs = JSON.parse(JSON.stringify(feature.preEditAttrs));//lang.clone(feature.preEditAttrs);
            }
          }
          if (feature.getLayer().originalLayerId) {
            // added feature
            //featureLayer = this.map.getLayer(feature.getLayer().originalLayerId);
            //Get layer or table info as now user can update related records/features
            featureLayer = this._jimuLayerInfos.getLayerOrTableInfoById(feature.getLayer().originalLayerId).layerObject;
            if (featureLayer) {
              returnFeature.geometry = feature.geometry;
              returnFeature.symbol = null;
              type = "Add";
              removeOIDField = true;

            } // if featureLayer not null
          } else {
            // update existing feature
            // only get the updated attributes

            if (this.geometryChanged !== undefined &&
              this.geometryChanged !== null &&
              this.geometryChanged === true) {
              returnFeature.geometry = feature.geometry;
            }

            featureLayer = feature.getLayer();

            var newAttrs = editUtils.filterOnlyUpdatedAttributes(
              returnFeature.attributes, returnFeature.preEditAttrs, featureLayer);

            if (newAttrs && !editUtils.isObjectEmpty(newAttrs)) {
              // there are changes in attributes
              returnFeature.attributes = newAttrs;
            } else {
              returnFeature.attributes = [];
            }
            returnFeature.symbol = null;
            type = "Update";
          }
          featureLayerId = featureLayer.id;
          if (returnFeature && removeOIDField) {
            if (returnFeature.attributes.hasOwnProperty(featureLayer.objectIdField)) {
              delete returnFeature.attributes[featureLayer.objectIdField];
            }
          }

          if (featureLayer.globalIdField && returnFeature.attributes.hasOwnProperty(featureLayer.globalIdField)) {
            delete returnFeature.attributes[featureLayer.globalIdField];
          }
          if (featureLayer.editFieldsInfo) {
            for (k in featureLayer.editFieldsInfo) {
              if (featureLayer.editFieldsInfo.hasOwnProperty(k)) {
                if (returnFeature.attributes.hasOwnProperty(featureLayer.editFieldsInfo[k])) {
                  delete returnFeature.attributes[featureLayer.editFieldsInfo[k]];
                }
              }
            }
          }

        }

        return [returnFeature, featureLayerId, type];
      },

      addDeferred: function (postDef, feature, featureLayer, deferred) {
        postDef.then(lang.hitch(this, function (added, updated) {
          // sometimes a successfully update returns an empty array
          if (updated && updated.length > 0 && updated[0].hasOwnProperty("error")) {
            Message({
              message: updated[0].error.toString()
            });
            deferred.resolve("failed");
          }
          else if (updated && updated.length > 0) {
            feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
            featureLayer.refresh();
            this.geometryChanged = false;
            deferred.resolve("success");
          }
          else if (added && added.length > 0 && added[0].hasOwnProperty("error")) {

            Message({
              message: added[0].error.toString()
            });
            deferred.resolve("failed");
          }
          else if (added && added.length > 0) {
            feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
            var defs = null;
            if (this.attrInspector._attachmentUploader) {
              defs = this.attrInspector._attachmentUploader.postAttachments(featureLayer, added[0].objectId);
            }
            if (defs === undefined || defs === null || defs.length === 0) {
              if (this.addNewRelatedRecord) {
                deferred.resolve("success");
              } else {
                this._completePost(featureLayer, added[0].objectId, deferred);
              }
            }
            else {
              all(defs).then(lang.hitch(this,
                this._attachmentsComplete(featureLayer, added[0].objectId, deferred)));
            }
          }
        }), lang.hitch(this, function (err) {
          Message({
            message: err.message.toString() + "\n" + err.details
          });
          deferred.resolve("failed");
        }));
      },

      _processOnMapClick: function (evt) {
        // viewing/editing existing features
        // The logic of adding new feature to local layer is handled
        // in the draw end event of the draw tool

        this.map.infoWindow.hide();
        //Destroy all prev attributeInspectors
        array.forEach(this._attributeInspectorCollection, function (attributeInspector) {
          attributeInspector.destroy();
        });
        //reset array
        this._traversal = [];
        this._nodesCollection = [];
        this._paginationNodeCollection = [];
        this._buttonsWrapper = [];
        this._attributeInspectorCollection = [];
        this._relatedTablesInfo = {};

        // recreate the attr inspector if needed
        this._createAttributeInspector(this.config.editor.configInfos);

        var layers = this.map.getLayersVisibleAtScale().filter(lang.hitch(this, function (lyr) {
          if (lyr.type && lyr.type === "Feature Layer" && lyr.url) {
            return array.some(this.config.editor.configInfos, lang.hitch(this, function (configInfo) {
              if (configInfo.layerId === lyr.id &&
                this._hasAnyEditableLayerInRelation([configInfo])) {
                return true;
              }
              else {
                return false;
              }
            }));
          }
          else {
            return false;
          }
        }));
        //remove no visible layers, for some reason the function above returns true
        layers = layers.filter(lang.hitch(this, function (lyr) {
          try {
            return this.map.getLayer(lyr.id).visible;
          }
          catch (ex) {
            console.log(ex + " Check for visible failed");
            return true;
          }
        }));
        var updateFeatures = [];
        var deferreds = [];
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
        array.forEach(layers, lang.hitch(this, function (layer) {
          // set selection symbol
          layer.setSelectionSymbol(this._getSelectionSymbol(layer.geometryType, false));
          var selectQuery = new Query();
          selectQuery.geometry = editUtils.pointToExtent(this.map, evt.mapPoint, 20);
          var deferred = layer.selectFeatures(selectQuery,
            FeatureLayer.SELECTION_NEW,
            lang.hitch(this, function (features) {
              var OIDsToRemove = [];
              var validFeatures = [];
              array.forEach(features, function (feature) {
                var featureValid = true;
                feature.allowDelete = true;
                //if (layer.hasOwnProperty("ownershipBasedAccessControlForFeatures") &&
                //  layer.ownershipBasedAccessControlForFeatures) {
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToUpdate === false && this._user) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== this._user) {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToUpdate") &&
                //    layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToUpdate === false &&
                //      layer.ownershipBasedAccessControlForFeatures.allowAnonymousToUpdate === true &&
                //      this._user === null) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== null &&
                //         feature.attributes[layer.editFieldsInfo.creatorField] !== "") {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  else if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToUpdate")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowAnonymousToUpdate === false &&
                //      this._user === null) {
                //      OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //      featureValid = false;
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToDelete === false &&
                //      this._user) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== this._user) {
                //        feature.allowDelete = false;
                //      }
                //    }
                //  }
                //  if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowOthersToDelete") &&
                //  layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowOthersToDelete === false &&
                //      layer.ownershipBasedAccessControlForFeatures.allowAnonymousToDelete === true &&
                //      this._user === null) {
                //      if (feature.attributes[layer.editFieldsInfo.creatorField] !== null &&
                //          feature.attributes[layer.editFieldsInfo.creatorField] !== "") {
                //        OIDsToRemove.push(feature.attributes[layer.objectIdField]);
                //        featureValid = false;
                //      }
                //    }
                //  }
                //  else if (layer.ownershipBasedAccessControlForFeatures.hasOwnProperty("allowAnonymousToDelete")) {
                //    if (layer.ownershipBasedAccessControlForFeatures.allowAnonymousToDelete === false &&
                //      this._user === null) {
                //      feature.allowDelete = false;
                //    }
                //  }
                //}

                //The below is the preferred way, but this fails on public services and the user is logged in

                if (!layer.getEditCapabilities({ feature: feature }).canDelete) {
                  feature.allowDelete = false;
                }
                if (featureValid === true) {
                  feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
                  validFeatures.push(feature);
                }
              }, this);
              if (OIDsToRemove.length > 0) {
                var subQuery = new Query();
                subQuery.objectIds = OIDsToRemove;
                var subDef = layer.selectFeatures(subQuery, FeatureLayer.SELECTION_SUBTRACT,
                  lang.hitch(this, function (features) {
                    console.log(features.length);
                  }));
                deferreds.push(subDef);
              }
              updateFeatures = updateFeatures.concat(validFeatures);

            }));
          deferreds.push(deferred);
        }));
        if (deferreds.length === 0) {
          this._byPass = true;
          this.map.popupManager._showPopup(evt);
          this._byPass = false;
        }
        else {
          all(deferreds).then(lang.hitch(this, function () {
            this.updateFeatures = updateFeatures;
            if (this.updateFeatures.length > 0) {
              this._showTemplate(false);
            }
            else {
              this._byPass = true;
              this.map.popupManager._showPopup(evt);
              this._byPass = false;
            }
          }));
        }

      },
      _attachLayerHandler: function () {
        /*
        //CT - Commented the code as it was clearing parent features selection when moving to related feature
        if (this.layerHandle) {
          this.layerHandle.remove();
        }
        this.layerHandle = on(this.currentFeature._layer, 'selection-clear',
          lang.hitch(this, this._layerChangeOutside));
        this.own(this.layerHandle);
        */

        this._eventHandler = this.own(on(this.currentFeature._layer, "visibility-change", lang.hitch(this, function () {
          /*
          setTimeout(lang.hitch(this, function () {
            var cancelBtn = query(".cancelButton")[0];
            if (!cancelBtn) {
              //do nothing
            } else {
              on.emit(cancelBtn, 'click', { cancelable: true, bubbles: true });
            }
          }), 100);
          */
        })));
      },

      _removeLayerVisibleHandler: function () {
        if (this._eventHandler !== null) {
          array.forEach(this._eventHandler, lang.hitch(this, function (evt) {
            if (typeof evt.remove === "function") {
              evt.remove();
            }
          }));
          this._eventHandler = null;
        }
      },

      _postFeatureSave: function (evt) {
        if (this.updateFeatures && this.updateFeatures.length > 1) {
          array.forEach(this.updateFeatures, lang.hitch(this, function (feature) {
            feature.setSymbol(this._getSelectionSymbol(feature.getLayer().geometryType, false));
          }));
        }
        if (evt && evt.feature) {
          this.geometryChanged = false;
          this.currentFeature = evt.feature;
          this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
          this._attachLayerHandler();
          this.currentLayerInfo = this._getLayerInfoByID(this.currentFeature._layer.id);
          this.currentLayerInfo.isCache = false;
          this._createSmartAttributes();
          this._createAttributeInspectorTools();
          this._attributeInspectorTools.triggerFormValidation();
          this._validateAttributes();
          this._enableAttrInspectorSaveButton(false);
          if (this.currentFeature.hasOwnProperty("allowDelete")) {
            this._toggleDeleteButton(this.currentFeature.allowDelete && this.currentLayerInfo.allowDelete);
          }
          else {
            this._toggleDeleteButton(this.currentLayerInfo.allowDelete);
          }
          this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
            !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate ||
            (this.currentLayerInfo.featureLayer.hasZ && !this.currentLayerInfo.featureLayer.enableZDefaults) ||
            (this.currentLayerInfo.featureLayer.hasM && !this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues));
          this.currentFeature.setSymbol(
            this._getSelectionSymbol(evt.feature.getLayer().geometryType, true));
          //this.getConfigDefaults();
        }

      },

      _promptToDelete: function () {

        var dialog = new Popup({
          titleLabel: this.nls.deletePromptTitle,
          width: 400,
          maxHeight: 200,
          autoHeight: true,
          content: this.nls.deletePrompt,
          buttons: [{
            label: this.nls.yes,
            classNames: ['jimu-btn'],
            onClick: lang.hitch(this, function () {
              this._deleteFeature();
              dialog.close();

            })
          }, {
            label: this.nls.no,
            classNames: ['jimu-btn'],

            onClick: lang.hitch(this, function () {

              dialog.close();

            })
          }

          ],
          onClose: lang.hitch(this, function () {

          })
        });
      },
      _promptToResolvePendingEdit: function (switchToTemplate, evt, showClose, skipPostEvent) {
        skipPostEvent = skipPostEvent || false;
        var disable = !this._validateAttributes();
        var tabindex = disable ? -1 : 0;
        var pendingEditsDef = new Deferred();
        var buttons = [{
          label: this.nls.yes,
          classNames: ['jimu-btn'],
          disable: disable,
          onClick: lang.hitch(this, function () {
            this._saveEdit(this.currentFeature, switchToTemplate, true).then(lang.hitch(this, function () {
              if (evt !== null && evt !== undefined) {
                if (evt.hasOwnProperty('featureLayer') && evt.hasOwnProperty('feature')) {
                  this.load_from_featureaction(evt.featureLayer, evt.feature);
                }
                else {
                  this._postFeatureSave(evt);
                }
              }
              pendingEditsDef.resolve("yes");
            }));
            dialog.close();
          })
        }, {
          label: this.nls.no,
          classNames: ['jimu-btn'],

          onClick: lang.hitch(this, function () {
            this._cancelEditingFeature(switchToTemplate);
            if (evt !== null && evt !== undefined) {
              if (evt.hasOwnProperty('featureLayer') && evt.hasOwnProperty('feature')) {
                this.load_from_featureaction(evt.featureLayer, evt.feature);
              }
              else {
                this._postFeatureSave(evt);
              }
            }
            dialog.close();
            pendingEditsDef.resolve("no");
          })
        }];
        if (showClose && showClose === true) {
          buttons.push({
            label: this.nls.back,
            classNames: ['jimu-btn'],
            onClick: lang.hitch(this, function () {
              pendingEditsDef.reject();
              dialog.close();
            })
          });
        }

        var dialog = new Popup({
          titleLabel: this.nls.savePromptTitle,
          width: 400,
          maxHeight: 200,
          autoHeight: true,
          content: this.nls.savePrompt,
          buttons: buttons,
          onClose: lang.hitch(this, function () {

          })
        });
        domAttr.set(dialog.disabledButtons[0], "tabindex", tabindex);
        return pendingEditsDef.promise;
      },

      _removeLocalLayers: function () {
        if (this.cacheLayer && this.cacheLayer !== null) {
          this.cacheLayer.clearSelection();
          this.cacheLayer.clear();
          this.map.removeLayer(this.cacheLayer);
          this.cacheLayer = null;
        }
        this.updateFeatures = [];
        //var mymap = this.map;
        //if (mymap) {
        //  var filteredID = mymap.graphicsLayerIds.filter(function (e) {
        //    return e.lastIndexOf("_lfl") > 0;
        //  });
        //  var mappedArr = array.map(filteredID, function (e) {
        //    return mymap.getLayer(e);
        //  });
        //  array.forEach(mappedArr, function (e) {
        //    mymap.removeLayer(e);
        //  });

        //  this.updateFeatures = [];
        //}
      },

      _removeSpacesInLayerTemplates: function (layer) {
        if (!layer) { return; }

        var filteredFields = array.filter(layer.fields, lang.hitch(this, function (field) {
          return field.nullable === false && field.editable === true;
        }));
        array.forEach(filteredFields, lang.hitch(this, function (f) {
          // trim of space in the field value
          array.forEach(layer.templates, function (t) {
            if (t.prototype.attributes[f.name] === " ") {
              t.prototype.attributes[f.name] = t.prototype.attributes[f.name].trim();
            }
          });
        }));
      },

      _resetEditingVariables: function () {
        this._editingEnabled = false;
        if (this.editToolbar) {
          if (this.editToolbar.getCurrentState().tool !== 0) {
            this.editToolbar.deactivate();
          }
        }
        //this._turnEditGeometryToggleOff();
      },
      _feature_removed: function (feature, curidx) {
        return function () {
          if (this.attrInspector._featureIdx >= curidx && curidx !== 0) {
            //Clear the current feature as it is saved and has been removed.  This prevents the double save dialog.
            this.currentFeature = null;
            this.attrInspector.previous();
          }
          this.updateFeatures.splice(this.updateFeatures.indexOf(feature), 1);
          //bypass moving to the next record if the user click next and was prompted to save

        };
      },
      // perform validation then post the changes or formatting the UI if errors
      // no confirm dialog involved
      _saveEdit: function (feature, switchToTemplate, attInspectRecordOptions) {
        attInspectRecordOptions = attInspectRecordOptions || 'next';
        var deferred = new Deferred();
        // disable the save button even if the saving is done
        this._enableAttrInspectorSaveButton(false);
        this._turnEditGeometryToggleOff();
        if (this._validateAttributes()) {
          var processIndicators = query(".processing-indicator");
          var processIndicatorsPanel = query(".processing-indicator-panel");
          var saveBtn = query(".saveButton", this.buttonHeader)[0];
          array.forEach(processIndicators, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          array.forEach(processIndicatorsPanel, function (processIndicator) {
            if (!domClass.contains(processIndicator, "busy")) {
              domClass.add(processIndicator, "busy");
            }
          });
          if (saveBtn && !domClass.contains(saveBtn, "hide")) {
            domClass.add(saveBtn, "hide");
          }
          // call applyEdit
          this._postChanges(feature).then(lang.hitch(this, function (e) {
            var addingRelatedRecord = false;
            if (e === "failed") {
              deferred.resolve("failed");
              this.addNewRelatedRecord = false;
            }
            else {
              if (this.addNewRelatedRecord) {
                addingRelatedRecord = true;
                this.attrInspector.destroy();
                domConstruct.destroy(this.contentWrapper);
                domConstruct.destroy(this.buttonHeader);
                this.attrInspector = this._attributeInspectorCollection.pop();
                domStyle.set(this.attrInspector.attributeTable, "display", "block");
                domStyle.set(this.attrInspector.editButtons, "display", "block");
                domStyle.set(this.attrInspector.deleteBtn.domNode, "display", "none");
                this.attrInspector._featureIdx = this.attrInspector.ctStoredFeatureIndex;
                this.attrInspector.refresh();
                setTimeout(lang.hitch(this, function () {
                  domStyle.set(this.attrInspector.navButtons, "display",
                    (!this.attrInspector._hideNavButtons && (this.attrInspector._numFeatures > 1) ? "" : "none"));
                  this.attrInspector.navMessage.innerHTML = esriLang.substitute({
                    idx: this.attrInspector._featureIdx + 1,
                    of: this.attrInspector.NLS_of,
                    numFeatures: this.attrInspector._numFeatures
                  }, this.attrInspector._navMessage);
                  this.currentFeature = this.attrInspector._numFeatures ?
                    this.attrInspector._selection[this.attrInspector._featureIdx] : null;
                  if (this.currentFeature && this.currentFeature.attributes) {
                    this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
                  }
                }), 200);
                this.contentWrapper = this._nodesCollection.pop();
                this.buttonHeader = this._buttonsWrapper.pop();
                this._traversal.pop();
                //If the related feature count is 0, change it to 1 as new record is added
                //This will trigger the further process automatically
                if (this.currentRelatedDom) {
                  var relatedRecordCount = domAttr.get(this.currentRelatedDom, "relatedRecordCount");
                  if ((relatedRecordCount && parseInt(relatedRecordCount, 10) === 0)) {
                    domAttr.set(this.currentRelatedDom, "relatedRecordCount", 1);
                  }
                }
                this.currentRelatedDom.click();
              }
              if (this.currentFeature && this.currentFeature.attributes) {
                this.currentFeature.preEditAttrs = JSON.parse(JSON.stringify(this.currentFeature.attributes));
              }
              if (this._relatedTablesInfo[feature._layer.id]) {
                this._relatedTablesInfo[feature._layer.id].updateFeatureInstance(feature.attributes);
              }
              // if currently only one selected feature
              //also this is not related feature
              if (this.config.editor.removeOnSave && this.updateFeatures.length <= 1 &&
                this._traversal.length <= 1 && !addingRelatedRecord) {
                switchToTemplate = true;
              }
              if (switchToTemplate && switchToTemplate === true) {
                this._showTemplate(true);
              } else if (this.config.editor.removeOnSave && this.updateFeatures.length <= 1 &&
                this._traversal.length > 1) {
                //when saving related tables/layers details and only one record and remove on save is true
                //go back to parent features details after save
                on.emit(this.cancelButton, 'click', { cancelable: true, bubbles: true });
              } else {
                this._resetEditingVariables();
                this.map.setInfoWindowOnClick(true);
                if (this.config.editor.removeOnSave === true && !addingRelatedRecord) {
                  var layer = feature.getLayer();
                  // perform a new query
                  var query = new Query();
                  query.objectIds = [feature.attributes[layer.objectIdField]];
                  var curidx = this.attrInspector._selection.indexOf(feature);
                  layer.selectFeatures(query, FeatureLayer.SELECTION_SUBTRACT,
                    lang.hitch(this, this._feature_removed(feature, curidx)));
                } else {
                  // reselect the feature
                  if (this.currentFeature && this.currentFeature.hasOwnProperty("allowDelete")) {
                    this._toggleDeleteButton(this.currentFeature.allowDelete &&
                      this.currentLayerInfo.allowDelete);
                  }
                  else {
                    this._toggleDeleteButton(this.currentLayerInfo.allowDelete &&
                      this.currentLayerInfo.configFeatureLayer.layerAllowsDelete);
                  }
                  this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                    !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate ||
                    (this.currentLayerInfo.featureLayer.hasZ && !this.currentLayerInfo.featureLayer.enableZDefaults) ||
                    (this.currentLayerInfo.featureLayer.hasM && !this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues));

                  if (this.currentLayerInfo.featureLayer.visibleAtMapScale &&
                    this.config.editor.hasOwnProperty("editGeometryDefault") &&
                    this.config.editor.editGeometryDefault === true) {
                    //perform any edit geom switch functionality
                    //only when working with main layers feature and not on related features
                    setTimeout(lang.hitch(this, function () {
                      if (this._traversal.length < 2) {
                        this._editGeomSwitch.set('checked', true);
                        this._editGeomSwitch.check();
                      }
                    }), 100);
                  }
                  feature.setSymbol(this._getSelectionSymbol(
                    feature.getLayer().geometryType, true));
                }
              }
              deferred.resolve("success");
              if ((this.config.editor.removeOnSave && this.attrInspector._numFeatures === 0) ||
                switchToTemplate) {
                this._setWidgetFirstFocusNode("templatePicker", true);
              } else {
                this._setWidgetFirstFocusNode("AI", true);
              }
            }
            array.forEach(processIndicators, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            array.forEach(processIndicatorsPanel, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            if (domClass.contains(saveBtn, "hide")) {
              domClass.remove(saveBtn, "hide");
            }
          }), lang.hitch(this, function () {
            array.forEach(processIndicators, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            array.forEach(processIndicatorsPanel, function (processIndicator) {
              if (domClass.contains(processIndicator, "busy")) {
                domClass.remove(processIndicator, "busy");
              }
            });
            if (domClass.contains(saveBtn, "hide")) {
              domClass.remove(saveBtn, "hide");
            }
            //deferred.resolve("failed");
          }));
        }
        //else
        //{
        //  this._formatErrorFields(errorObj);

        //  deferred.resolve("failed");
        //}
        return deferred.promise;
      },

      _showTemplate: function (showTemplate) {
        this._attrInspIsCurrentlyDisplayed = !showTemplate;
        if (showTemplate) {
          this._mapClickHandler(true);
          this._showTemplatePicker();
          //reset array
          this._traversal = [];
          this._nodesCollection = [];
          this._paginationNodeCollection = [];
          this._buttonsWrapper = [];
          this._attributeInspectorCollection = [];
          this._relatedTablesInfo = {};
          this.currentFeature = null;
          this.geometryChanged = false;
          this.currentLayerInfo = null;

          // esriBundle.widgets.attachmentEditor.NLS_attachments = this._orignls;
        } else {
          //esriBundle.widgets.attachmentEditor.NLS_attachments = this._orignls + " " + this.nls.attachmentSaveDeleteWarning;
          this._mapClickHandler(false);
          //show attribute inspector
          query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "none";
          query(".jimu-widget-smartEditor .attributeInspectorMainDiv")[0].style.display = "block";

          if (this.attrInspector) {

            if (!this.currentFeature && this.attrInspector && this.attrInspector._numFeatures > 0) {
              this.attrInspector.first();
            }
            this.attrInspector.refresh();
            this._createSmartAttributes();
            this._createAttributeInspectorTools();
            this._attributeInspectorTools.triggerFormValidation();
            //this._sytleFields(this.attrInspector);
            if (this.currentFeature && this.currentFeature.getLayer().originalLayerId) {
              this._enableAttrInspectorSaveButton(this._validateAttributes());
            } else {
              this._validateAttributes(false);
              this._enableAttrInspectorSaveButton(false);
            }
            if (this.currentLayerInfo.isCache && this.currentLayerInfo.isCache === true) {
              this._toggleEditGeoSwitch(false);
            }
            else {
              this._toggleEditGeoSwitch(this.currentLayerInfo.disableGeometryUpdate ||
                !this.currentLayerInfo.configFeatureLayer.layerAllowsUpdate ||
                (this.currentLayerInfo.featureLayer.hasZ && !this.currentLayerInfo.featureLayer.enableZDefaults) ||
                (this.currentLayerInfo.featureLayer.hasM && !this.currentLayerInfo.featureLayer.allowUpdateWithoutMValues));
            }
            this._addWarning();
            this._setWidgetFirstFocusNode("AI", true);
          }
          this._recordLoadeAttInspector();
        }


      },
      _createAttributeInspectorTools: function () {
        if (this.currentFeature === undefined || this.currentFeature === null) {
          return;
        }
        var attTable = query("td.atiLabel", this.attrInspector.domNode);
        if (attTable === undefined || attTable === null) {
          return;
        }
        var attributeInspectorToolsParams = {
          _attrInspector: this.attrInspector,
          _feature: this.currentFeature,
          _fieldInfo: this.currentLayerInfo.fieldInfos
        };
        this._attributeInspectorTools = new attributeInspectorTools(attributeInspectorToolsParams);

      },
      _createSmartAttributes: function () {
        if (this.currentFeature === undefined || this.currentFeature === null) {
          return;
        }
        var attTable = query("td.atiLabel", this.attrInspector.domNode);
        if (attTable === undefined || attTable === null) {
          return;
        }
        var fieldValidation = null;
        if (this.currentLayerInfo !== undefined && this.currentLayerInfo !== null) {
          if (this.currentLayerInfo.fieldValidations !== undefined &&
            this.currentLayerInfo.fieldValidations !== null) {
            fieldValidation = this.currentLayerInfo.fieldValidations;
          }
        }
        if (fieldValidation === null) {
          return;
        }

        var smartAttParams = {
          _attrInspector: this.attrInspector,
          _fieldValidation: fieldValidation,
          _feature: this.currentFeature,
          _fieldInfo: this.currentLayerInfo.fieldInfos,
          _url: this.currentLayerInfo.featureLayer.url
        };
        this._smartAttributes = new smartAttributes(smartAttParams);
        this.own(on(this._smartAttributes, "onFieldToggle", lang.hitch(this,
          function () {
            this._add508SupportToAttachmentsDeleteBtn("AI");
          })));
      },
      _showTemplatePicker: function () {

        // hide the attr inspector and show the main template picker div
        query(".jimu-widget-smartEditor .attributeInspectorMainDiv")[0].style.display = "none";
        query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "block";


        if (this.templatePicker) {
          if (this.config.editor.hasOwnProperty("keepTemplateSelected")) {
            if (this.config.editor.keepTemplateSelected !== true) {
              this.templatePicker.clearSelection();
            }
          } else {
            this.templatePicker.clearSelection();
          }
          if (this.templatePicker) {
            var override = null;
            if (this.drawingTool && this.currentDrawType) {
              override = this.currentDrawType;
            }
            this._activateTemplateToolbar(override);
            this.templatePicker.update();
          }
        }
        this._resetEditingVariables();

        var layersRefresh = [];
        if (this.updateFeatures) {
          array.forEach(this.updateFeatures, lang.hitch(this, function (feature) {
            var layer = feature.getLayer();
            if (layersRefresh && layersRefresh.indexOf(layer.id) === -1) {
              layersRefresh.push(layer.id);
              layer.clearSelection();
              layer.refresh();
            }

          }));
        }
        this._clearLayerSelection();
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
        this._removeLocalLayers();
        if (this._recreateOnNextShow === true) {
          this._recreateOnNextShow = false;
          this._createEditor();
        }
        if (this._creationDisabledOnAll) {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "none");
          }
          if (this.drawingTool) {
            dojo.style(this.drawingTool.domNode, "display", "none");
          }
        } else {
          if (this.templatePicker) {
            dojo.style(this.templatePicker.domNode, "display", "block");
          }
          if (this.drawingTool) {
            dojo.style(this.drawingTool.domNode, "display", "block");
          }
        }
        // It is used to reset all the parameters which were activated while dealing with
        // custom select tool option. Resetting parameter like de-activating custom select tool.
        if (this._copyFeaturesObj) {
          this._copyFeaturesObj.cancelBtnClicked();
        }
      },
      _setPresetValue: function () {
        var sw = registry.byId("savePresetValueSwitch");
        this._usePresetValues = sw.checked;
      },
      _toggleUsePresetValues: function (checked) {
        var sw = registry.byId("savePresetValueSwitch");
        // sw.set('checked', checked === null ? !sw.checked : checked);
        // code written to handle checkbox check as checkbox changed to jimu checkbox
        if (checked) {
          sw.check();
        }
        else {
          sw.uncheck();
        }
        this._usePresetValues = sw.checked;
      },
      _turnEditGeometryToggleOff: function () {
        //perform any edit geom switch functionality
        //only when working with main layers feature and not on related features
        if (this._traversal.length > 1) {
          return;
        }
        if (this._editGeomSwitch && this._editGeomSwitch.checked) {
          if (this.editToolbar) {
            if (this.editToolbar.getCurrentState().tool !== 0) {
              this.editToolbar.deactivate();
            }
          }
          this._editingEnabled = false;
          this._ignoreEditGeometryToggle = true;
          this._editGeomSwitch.set("checked", false);
          this._editGeomSwitch.uncheck();
          this.map.setInfoWindowOnClick(true);
          setTimeout(lang.hitch(this, function () {
            this._ignoreEditGeometryToggle = false;
          }), 2);

        }
      },
      _validateFeatureChanged: function () {

        if (this.currentFeature) {

          if (this.geometryChanged !== undefined &&
            this.geometryChanged !== null &&
            this.geometryChanged === true) {
            return true;
          }
          var result = this._changed_feature(this.currentFeature, true);
          var feature = result[0];
          var type = result[2];
          if (feature !== null) {
            if (Object.keys(feature.attributes).length === 0 &&
              type !== "Add") {
              return false;
            }
          }
        }
        return true;
      },
      // todo: modify to feature as input parameter?
      _validateRequiredFields: function () {
        var errorObj = {};

        if (!this.currentFeature) { return errorObj; }

        var layer = this.currentFeature.getLayer();

        var filteredFields = array.filter(layer.fields, lang.hitch(this, function (field) {
          return field.nullable === false && field.editable === true;
        }));

        array.forEach(filteredFields, lang.hitch(this, function (f) {
          if (this.currentFeature.attributes[f.name] === "undefined") {
            errorObj[f.alias] = "undefined";
          }
          else if (this.currentFeature.attributes[f.name] === null) {
            errorObj[f.alias] = "null";
          }
          else {
            switch (f.type) {
              case "esriFieldTypeString":
                if (this.currentFeature.attributes[f.name] === "" ||
                  (this.currentFeature.attributes[f.name] &&
                    this.currentFeature.attributes[f.name].trim() === "")) {
                  errorObj[f.alias] = "Empty string";
                }
                break;
              default:
                break;
            }
          }
        }));
        return errorObj;
      },

      _worksAfterClose: function () {
        // restore the default string of mouse tooltip
        esriBundle.toolbars.draw.start = this._defaultStartStr;
        esriBundle.toolbars.draw.addPoint = this._defaultAddPointStr;

        // show lable layer.
        //var labelLayer = this.map.getLayer("labels");
        //if (labelLayer) {
        //  labelLayer.show();
        //}
      },

      _workBeforeCreate: function () {

        // change string of mouse tooltip

        /* MJM - don't need tip
        var additionStr = "<br/>" + "(" + this.nls.pressStr + "<b>" +
          this.nls.ctrlStr + "</b> " + this.nls.snapStr + ")";
          */
        var additionStr = "";  //MJM

        this._defaultStartStr = esriBundle.toolbars.draw.start;
        this._defaultAddPointStr = esriBundle.toolbars.draw.addPoint;
        esriBundle.toolbars.draw.start =
          esriBundle.toolbars.draw.start + additionStr;
        esriBundle.toolbars.draw.addPoint =
          esriBundle.toolbars.draw.addPoint + additionStr;

        // hide label layer.
        //var labelLayer = this.map.getLayer("labels");
        //if (labelLayer) {
        //  labelLayer.hide();
        //}

      },

      _getDefaultFieldInfos: function (layerObject) {
        // summary:
        //  filter webmap fieldInfos.
        // description:
        //   return null if fieldInfos has not been configured in webmap.
        //layerObject = this.map.getLayer(layerInfo.featureLayer.id);
        var fieldInfos = editUtils.getFieldInfosFromWebmap(layerObject.id, this._jimuLayerInfos);//
        if (fieldInfos === undefined || fieldInfos === null) {
          fieldInfos = editUtils.getFieldInfosLayer(layerObject.id, this._jimuLayerInfos);
        }
        if (fieldInfos) {
          fieldInfos = array.filter(fieldInfos, function (fieldInfo) {
            return fieldInfo.visible || fieldInfo.isEditable;
          });
        }
        return fieldInfos;
      },

      _getDefaultLayerInfos: function () {
        var defaultLayerInfos = [];
        var fieldInfos;
        for (var i = this.map.graphicsLayerIds.length - 1; i >= 0; i--) {
          var layerObject = this.map.getLayer(this.map.graphicsLayerIds[i]);
          if (layerObject.type === "Feature Layer" && layerObject.url) {
            var layerInfo = {
              featureLayer: {}
            };
            layerInfo.featureLayer.id = layerObject.id;
            layerInfo.disableGeometryUpdate = false;
            layerInfo.allowUpdateOnly = false; //
            fieldInfos = this._getDefaultFieldInfos(layerObject);
            if (fieldInfos && fieldInfos.length > 0) {
              layerInfo.fieldInfos = fieldInfos;
            }
            defaultLayerInfos.push(layerInfo);
          }
        }
        return defaultLayerInfos;
      },

      _converConfiguredLayerInfos: function (layerInfos) {
        array.forEach(layerInfos, function (layerInfo) {
          // convert layerInfos to compatible with old version
          var layerObject;
          if (!layerInfo.featureLayer.id && layerInfo.featureLayer.url) {
            layerObject = this.getLayerObjectFromMapByUrl(this.map, layerInfo.featureLayer.url);
            if (layerObject) {
              layerInfo.featureLayer.id = layerObject.id;

            }
          }
          else {
            layerObject = this.map.getLayer(layerInfo.featureLayer.id);

          }
          var layID = layerInfo.featureLayer.id;
          if (layerInfo.featureLayer.hasOwnProperty("originalLayerId")) {
            layID = layerInfo.featureLayer.originalLayerId;
          }
          if (layerObject) {
            // convert fieldInfos
            var newFieldInfos = [];
            var webmapFieldInfos =
              editUtils.getFieldInfosFromWebmap(layID, this._jimuLayerInfos);
            if (webmapFieldInfos === undefined || webmapFieldInfos === null) {
              webmapFieldInfos = editUtils.getFieldInfosLayer(layID, this._jimuLayerInfos);
            }
            array.forEach(webmapFieldInfos, function (webmapFieldInfo) {
              if (webmapFieldInfo.fieldName !== layerObject.globalIdField &&
                webmapFieldInfo.fieldName !== layerObject.objectIdField &&
                webmapFieldInfo.type !== "esriFieldTypeGeometry" &&
                webmapFieldInfo.type !== "esriFieldTypeOID" &&
                webmapFieldInfo.type !== "esriFieldTypeBlob" &&
                webmapFieldInfo.type !== "esriFieldTypeGlobalID" &&
                webmapFieldInfo.type !== "esriFieldTypeRaster" &&
                webmapFieldInfo.type !== "esriFieldTypeXML") {
                //var found = array.some(layerInfo.fieldInfos, function (fieldInfo) {
                //  return (webmapFieldInfo.fieldName === fieldInfo.fieldName);
                //});
                //if (found === true) {
                var webmapFieldInfoNew = this.getFieldInfoFromWebmapFieldInfos(webmapFieldInfo, layerInfo.fieldInfos);

                if (webmapFieldInfoNew.visible === true) {
                  newFieldInfos.push(webmapFieldInfoNew);
                }

              }

            }, this);

            if (newFieldInfos.length !== 0) {
              layerInfo.fieldInfos = newFieldInfos;
            }
            //layerInfo = this._modifyFieldInfosForEE(layerInfo);
            //layerInfo.fieldInfo = this._processFieldInfos(layerInfo.fieldInfo);
          }
        }, this);
        return layerInfos;

      },
      getLayerObjectFromMapByUrl: function (map, layerUrl) {
        var resultLayerObject = null;
        for (var i = 0; i < map.graphicsLayerIds.length; i++) {
          var layerObject = map.getLayer(map.graphicsLayerIds[i]);
          if (layerObject.url.toLowerCase() === layerUrl.toLowerCase()) {
            resultLayerObject = layerObject;
            break;
          }
        }
        return resultLayerObject;
      },

      getFieldInfoFromWebmapFieldInfos: function (webmapFieldInfo, fieldInfos) {
        var foundInfo = {};
        var foundInfos = array.filter(fieldInfos, function (fieldInfo) {
          return (webmapFieldInfo.fieldName === fieldInfo.fieldName);
        });
        if (foundInfos) {
          if (foundInfos.length >= 1) {
            foundInfo = foundInfos[0];
          } else {
            foundInfo = webmapFieldInfo;
          }

        }
        foundInfo.label = foundInfo.label === undefined ?
          webmapFieldInfo.label : foundInfo.label;

        foundInfo.visible = foundInfo.visible === undefined ?
          webmapFieldInfo.visible : foundInfo.visible;

        foundInfo.isEditableSettingInWebmap = webmapFieldInfo.isEditable === undefined ?
          true : webmapFieldInfo.isEditable;

        foundInfo.isEditable = foundInfo.isEditable === undefined ?
          webmapFieldInfo.isEditable : foundInfo.isEditable;

        foundInfo.canPresetValue = foundInfo.canPresetValue === undefined ?
          false : foundInfo.canPresetValue;

        foundInfo.format = webmapFieldInfo.format === undefined ?
          null : webmapFieldInfo.format;

        for (var k in webmapFieldInfo) {
          if (webmapFieldInfo.hasOwnProperty(k)) {
            if (foundInfo.hasOwnProperty(k) === false) {
              foundInfo[k] = webmapFieldInfo[k];
            }
          }
        }
        return foundInfo;
      },
      getConfigDefaults: function () {
        if (this.config.editor.hasOwnProperty("editGeometryDefault") &&
          this.config.editor.editGeometryDefault === true) {
          setTimeout(lang.hitch(this, function () {
            //perform any edit geom switch functionality
            //only when working with main layers feature and not on related features
            if (this._traversal.length < 2 && this._editGeomSwitch.domNode) {
              // code return to handle checkbox check as kimu checkbox added 
              this._editGeomSwitch.check();
            }
          }), 100);
        } else {
          this._turnEditGeometryToggleOff();
        }
      },

      _processConfig: function () {
        /*CT- commented as we need to show non editable layers also
        this.config.editor.configInfos = array.filter(this.config.editor.configInfos, function (configInfo) {
             if (configInfo._editFlag && configInfo._editFlag === true) {
               return true;
             } else {
               return false;
             }
           });*/
        array.forEach(this.config.editor.configInfos, function (configInfo) {
          //To support backward compatibility if _editFlag is not available add it
          if (!configInfo.hasOwnProperty('_editFlag')) {
            configInfo._editFlag = true;
          }
          var layerObject = configInfo.layerInfo.layerObject;
          if (layerObject) {
            if (configInfo.allowUpdateOnly === false) {
              this.own(on(layerObject, "visibility-change, scale-visibility-change", lang.hitch(this, function () {
                if (this._layerScaleClearedTimer) {
                  clearTimeout(this._layerScaleClearedTimer);
                }
                this._layerScaleClearedTimer =
                  setTimeout(lang.hitch(this, function () {
                    this._createEditor();
                  }), 200);
              }
              )));
            }
            // modify templates with space in string fields
            this._removeSpacesInLayerTemplates(layerObject);
            this.processConfigForRuntime(configInfo);
            configInfo.configFeatureLayer = configInfo.featureLayer;
            configInfo.featureLayer = layerObject;
            configInfo.showDeleteButton = false;
          }
        }, this);
      },
      onClose: function () {
        this._worksAfterClose();

        //if (this.config.editor.clearSelectionOnClose) {
        //  if (this._isDirty) {
        //    this._promptToResolvePendingEdit(true).then(lang.hitch(this, function () {
        //      // set this variable for controlling the onMapClick (#494)
        //      this.map.setInfoWindowOnClick(true);
        //      this._attrInspIsCurrentlyDisplayed = true;
        //      this.templatePicker.clearSelection();
        //    }))

        //  } else {
        //    this._cancelEditingFeature(true);

        //    // set this variable for controlling the onMapClick
        //    this.map.setInfoWindowOnClick(true);
        //    this._attrInspIsCurrentlyDisplayed = true;
        //    this.templatePicker.clearSelection();
        //  }
        //} else
        //{
        this._mapClickHandler(false);
        this._removeLayerVisibleHandler();
        this._unLockMapNavigation();
        //}
        // close method will call onDeActive automaticlly
        // so do not need to call onDeActive();
      },
      _update: function () {
        //if (this.templatePicker) {
        //comments out, this results in teh scroll bar disappearing, unsure why


        //var widgetBox = html.getMarginBox(this.domNode);
        //var height = widgetBox.h;
        //var width = widgetBox.w;


        //var cols = Math.floor(width / 60);
        //this.templatePicker.attr('columns', cols);
        //this.templatePicker.update(true);


        // }
      },

      resize: function () {
        this._update();
      },
      onNormalize: function () {
        setTimeout(lang.hitch(this, this._update), 100);
      },

      onMinimize: function () {
        console.log("min");
      },

      onMaximize: function () {
        setTimeout(lang.hitch(this, this._update), 100);
      },

      /**
      * The function will add new item to item list as per the data
      */
      addItem: function (title, isOpen, itemListContainer, layerId, isTempFeature, layer) {
        var itemContainer;
        itemContainer = domConstruct.create("div", {
          "class": "esriCTItem"
        }, null);
        //domAttr.set(itemContainer, "index", index);
        this._createItemTitle(title, itemContainer, isOpen, isTempFeature, layer);
        this._createItemContent(itemContainer, isOpen, layerId);
        if (isTempFeature) {
          domClass.add(itemContainer, "esriCTDisableToggling");
          domAttr.set(itemContainer.children[0], "tabindex", "-1");
        }
        itemListContainer.appendChild(itemContainer);
        return itemContainer;
      },

      /**
      * Create item title node
      */
      _createItemTitle: function (title, itemContainer, isOpen, isTempFeature, layer) {
        var itemTitleContainer, itemTitle, arrowIcon, itemHighlighter;
        itemTitleContainer = domConstruct.create("div", {
          "class": "esriCTItemTitleContainer",
          "tabindex": "0",
          "role": "button",
          "aria-label": title
        }, itemContainer);
        //Item highlighter
        itemHighlighter = domConstruct.create("div", {
          "class": "esriCTItemHighlighter"
        }, itemTitleContainer);
        //create esriCTItemTitle
        itemTitle = domConstruct.create("div", {
          "class": "esriCTItemTitle esriCTFloatLeft",
          "innerHTML": title,
          "title": title
        }, itemTitleContainer);
        if (title === this.nls.relatedItemTitle) {
          domAttr.set(itemTitleContainer, "isRelatedItem", "true");
        }
        //Add opacity to layer title based on layer's visibility
        if (this._traversal.length <= 1 && layer && !layer.visibleAtMapScale) {
          itemTitle.style.opacity = "0.3";
        }
        //create arrow icon div
        arrowIcon = domConstruct.create("div", {
          "class": "itemTitleArrowIcon"
        }, itemTitleContainer);
        if (isOpen) {
          domClass.add(arrowIcon, "itemTitleUpArrow");
        } else {
          domClass.add(arrowIcon, "itemTitleDownArrow");
        }
        this.own(on(itemTitleContainer, "click", lang.hitch(this, function (evt) {
          if (!domClass.contains(evt.currentTarget.parentElement, "esriCTDisableToggling") && !isTempFeature) {
            this._togglePanel(itemContainer);
          }
        })));
        this.own(on(itemTitleContainer, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            if (!domClass.contains(evt.currentTarget.parentElement, "esriCTDisableToggling") && !isTempFeature) {
              this._togglePanel(itemContainer);
            }
          }
        })));
      },

      /**
      * Create content for each title row
      */
      _createItemContent: function (itemContainer, isOpen, layerId) {
        var itemContent, editDescription, configuredLayerDesc;
        //create node for adding item content
        itemContent = domConstruct.create("div", {
          "class": "esriCTItemContent esriCTRelatedItemContent"
        }, itemContainer);
        if (isOpen) {
          configuredLayerDesc = entities.decode(this._fetchLayerDescription(layerId));
          if (configuredLayerDesc) {
            //show configured description
            editDescription = domConstruct.create("div", {
              "class": "editDescription",
              "innerHTML": configuredLayerDesc,
              "role": "presentation",
              "tabindex": "0",
              "aria-label": utils.stripHTML(configuredLayerDesc)
            }, itemContent);
          }
          domConstruct.place(this.attrInspector.domNode, itemContent, "last");
          this._togglePanel(itemContainer);
        } else {
          if (this._relatedTablesInfo[this.attrInspector._currentFeature._layer.id] &&
            this._relatedTablesInfo[this.attrInspector._currentFeature._layer.id].domNode) {
            domConstruct.place(this._relatedTablesInfo[this.attrInspector._currentFeature._layer.id].domNode,
              itemContent, "last");
          }
        }
      },

      /**
      * Create item list based on the data passed
      */
      _togglePanel: function (node) {
        var title, panel, arrowIcon, itemHighlighter;
        title = query(".esriCTItemTitle", node)[0];
        arrowIcon = query(".itemTitleArrowIcon", node)[0];
        panel = query(".esriCTItemContent", node)[0];
        itemHighlighter = query(".esriCTItemHighlighter", node)[0];
        if (title && panel && !domClass.contains(node, "esriCTDisableToggling")) {
          if (!domClass.contains(panel, "esriCTItemContentActive")) {
            //set the item highlighter
            domStyle.set(itemHighlighter, "backgroundColor", this.config.selectedThemeColor);
            //toggle arrow icon class
            domClass.replace(arrowIcon, "itemTitleUpArrow", "itemTitleDownArrow");
            if (title.innerHTML === this.nls.relatedItemTitle) {
              this._setTabIndexToListItems(node, true, "0");
            } else {
              this._setTabIndexToListItems(node, false, "0");
            }
          } else {
            //set the item highlighter
            domStyle.set(itemHighlighter, "backgroundColor", "transparent");
            //toggle arrow icon class
            domClass.replace(arrowIcon, "itemTitleDownArrow", "itemTitleUpArrow");
            if (title.innerHTML === this.nls.relatedItemTitle) {
              this._setTabIndexToListItems(node, true, "-1");
            } else {
              this._setTabIndexToListItems(node, false, "-1");
            }
          }
          domClass.toggle(panel, "esriCTItemContentActive");
        }
        this._setWidgetFirstFocusNode("AI", false);
      },

      _setTabIndexToListItems: function (node, isRelatedTable, tabindex) {
        if (isRelatedTable) {
          var realtedTableItems = query(".relatedTableFields", node);
          array.forEach(realtedTableItems, lang.hitch(this, function (tableField) {
            domAttr.set(tableField, "tabindex", tabindex);
          }));
        } else {
          var widgets = registry.findWidgets(this.attrInspector.domNode);
          array.forEach(widgets, lang.hitch(this, function (currentWidget) {
            if (currentWidget.focusNode) {
              domAttr.set(currentWidget.focusNode, "tabindex", tabindex);
            }
          }));
          array.forEach(query(".esriCTCustomButtons", this.attrInspector.domNode),
            lang.hitch(this, function (button) {
              domAttr.set(button, "tabindex", tabindex);
            }));
          //Check if description is present
          //If yes handle the tabindexes accordingly
          var descriptionNode;
          descriptionNode = query(".editDescription", this.attrInspector.domNode.parentElement);
          if (descriptionNode && descriptionNode.length > 0) {
            domAttr.set(descriptionNode[0], "tabindex", tabindex);
          }
          //Change the edit geometry switch tabindex
          domAttr.set(this._editGeomSwitch.domNode, "tabindex", tabindex);
          this._setTabIndexToAttachmentSection(tabindex);
        }
      },
      _setTabIndexToAttachmentSection: function (tabindex) {
        if (this.attrInspector._attachmentEditor) {
          var attachmentNode, attachmentUploadForm;
          attachmentNode = this.attrInspector._attachmentEditor._attachmentList;
          attachmentUploadForm = this.attrInspector._attachmentEditor._uploadForm;
          if (attachmentUploadForm && domStyle.get(attachmentUploadForm, "display") === "block") {
            domAttr.set(attachmentUploadForm.children[0], "tabindex", tabindex);
          }
          if (attachmentNode && attachmentNode.childNodes.length > 0) {
            array.forEach(attachmentNode.childNodes, lang.hitch(this,
              function (childNode) {
                if (childNode.nodeName !== "#text") {
                  domAttr.set(childNode.children[0], "tabindex", tabindex);
                  domAttr.set(childNode.children[1], "tabindex", tabindex);
                }
              }));
          }
        }
      },

      /**
      * Disable expand/collapse of layer panel
      */
      _disableToggling: function (layerNode) {
        //var arrowNode;
        //remove layers expand/collapse arrow as it doesn't have any relation
        if (layerNode) {
          domClass.add(layerNode, "esriCTDisableToggling");
          domAttr.set(query(".esriCTItemTitleContainer", layerNode)[0], "tabindex", "-1");
        }
      },

      _fetchLayerDescription: function (selectedLayerId) {
        var configuredDesc;
        var currentConfig;
        currentConfig = this.config.editor.layerInfos;
        //get the config info of the selected breadcrumb and display its table
        if (this._traversal && this._traversal.length > 0) {
          array.some(this._traversal, function (layerId, layerIndex) {
            array.some(currentConfig, function (info) {
              if (info.featureLayer.id === layerId) {
                currentConfig = info;
                return true;
              }
            });
            //if current table is not of all-layers and the index is not last then consider the next relations
            if (this._traversal.length > 1 && layerIndex + 1 < this._traversal.length) {
              currentConfig = currentConfig.relationshipInfos;
            }

          }, this);
        } else {
          array.some(currentConfig, function (info) {
            if (info.featureLayer.id === selectedLayerId) {
              currentConfig = info;
              return true;
            }
          });
        }
        if (currentConfig.editDescription) {
          configuredDesc = currentConfig.editDescription;
        }
        if (configuredDesc === "<br>") {
          configuredDesc = "";
        }
        return configuredDesc;
      },

      _getRelationshipInfo: function (feature) {
        var id = feature._layer.id;
        if (this._traversal && this._traversal.length > 0) {
          var currentConfig;
          currentConfig = this.config.editor.configInfos;
          array.some(this._traversal, function (layerId, layerIndex) {
            array.some(currentConfig, function (info) {
              if (info.featureLayer.id === layerId) {
                currentConfig = info;
                return true;
              }
            });
            //if current table is not of all-layers and the index is not last then consider the next relations
            if (this._traversal.length > 1 && layerIndex + 1 < this._traversal.length) {
              currentConfig = currentConfig.relationshipInfos;
            }

          }, this);
          return currentConfig.relationshipInfos;
        } else {
          var result = null;
          this.config.editor.configInfos.some(function (configInfo) {
            return configInfo.featureLayer.id === id ? ((result = configInfo.relationshipInfos), true) : false;
          });
          return result;
        }
      },

      /***
      * Function gets the selected theme Color from app config and theme properties
      * In case of errors it will use "#000000" color
      */
      _getSelectedThemeColor: function () {
        var requestArgs, styleName, selectedTheme;
        // by default set it to black
        this.config.selectedThemeColor = "#000000";
        //Get selected theme Name
        selectedTheme = this.appConfig.theme.name;
        //get selected theme's style
        if (this.appConfig && this.appConfig.theme && this.appConfig.theme.styles) {
          styleName = this.appConfig.theme.styles[0];
        } else {
          styleName = "default";
        }
        //if custom styles are selected then use the selected color directly
        if (this.appConfig && this.appConfig.theme && this.appConfig.theme.customStyles &&
          this.appConfig.theme.customStyles.mainBackgroundColor) {
          this.config.selectedThemeColor = this.appConfig.theme.customStyles.mainBackgroundColor;
          return;
        }
        //create request to get the selected theme's manifest to fetch the color
        requestArgs = {
          url: "./themes/" + selectedTheme + "/manifest.json",
          content: {
            f: "json"
          },
          handleAs: "json",
          callbackParamName: "callback"
        };
        esriRequest(requestArgs).then(lang.hitch(this, function (response) {
          var i, styleObj;
          //match the selected style name and get its color
          if (response && response.styles && response.styles.length > 0) {
            for (i = 0; i < response.styles.length; i++) {
              styleObj = response.styles[i];
              if (styleObj.name === styleName) {
                this.config.selectedThemeColor = styleObj.styleColor;
                break;
              }
            }
          }
        }));
      },

      _getRelatedRecordsByRelatedQuery: function (layerObject, relationshipId, relatedLayersId, parentOID) {
        var def = new Deferred();
        var relatedQuery = new RelationshipQuery();
        var objectId = parentOID; //this.attrInspector._currentFeature.attributes[layerObject.objectIdField];
        var relatedLayer = this._jimuLayerInfos.getLayerOrTableInfoById(relatedLayersId).layerObject;
        var relatedObjectId = relatedLayer.objectIdField;

        relatedQuery.returnGeometry = false;
        relatedQuery.outSpatialReference = this.map.spatialReference;
        relatedQuery.relationshipId = relationshipId;
        relatedQuery.objectIds = [objectId];
        relatedQuery.outFields = [relatedObjectId]; //get only related tables OID so that it will be used for selection
        this.loading.show();
        layerObject.queryRelatedFeatures(
          relatedQuery,
          lang.hitch(this, function (relatedRecords) {
            var features = relatedRecords[objectId] && relatedRecords[objectId].features;
            var relatedObjectIds = [];
            array.forEach(features, function (feature) {
              relatedObjectIds.push(feature.attributes[relatedObjectId]);
            });
            this.loading.hide();
            if (features) {
              def.resolve(relatedObjectIds);
            } else {
              def.resolve(relatedObjectIds);
            }
          }), lang.hitch(this, function () {
            this.loading.hide();
            def.resolve([]);
          })
        );
        return def;
      },

      /* Refresh attributes on geometry change */
      _getCurrentFieldDijit: function (fieldName) {
        var fieldDijit;
        array.some(this.attrInspector._currentLInfo.fieldInfos,
          lang.hitch(this, function (fInfo) {
            if (fInfo.name === fieldName) {
              fieldDijit = fInfo.dijit;
              return true;
            }
          }));
        return fieldDijit;
      },

      _updateRefreshButtonState: function () {
        var hasGeometryDependency;
        if (this._refreshButton && this.config.editor.enableAttributeUpdates) {
          //if automatic update is configured to true show refresh button
          if (this.config.editor.enableAutomaticAttributeUpdates) {
            domClass.remove(this._refreshButton, "hidden");
            //if automatic update is 'ON' in the widget then call refresh attribute function
            if (domClass.contains(this._refreshButton, "esriCTAutoUpdateOnMode")) {
              this._refreshAttributes();
            }
          } else if (domAttr.has(this._refreshButton, "hasGeometryDependency")) {
            hasGeometryDependency = domAttr.get(this._refreshButton, "hasGeometryDependency");
            if (hasGeometryDependency) {
              domClass.remove(this._refreshButton, "hidden");
            }
          } else {
            if (this.currentLayerInfo.fieldValues) {
              hasGeometryDependency = false;
              //loop through all copy actions and get the values as per priority for individual actions
              for (var fieldName in this.currentLayerInfo.fieldValues) {
                for (var i = 0; i < this.currentLayerInfo.fieldValues[fieldName].length; i++) {
                  var copyAction = this.currentLayerInfo.fieldValues[fieldName][i];
                  //get value form intersection if it is enabled
                  if (copyAction.actionName === "Intersection" && copyAction.enabled) {
                    hasGeometryDependency = true;
                    break;
                  }
                  //get value from address if it is enabled
                  if (copyAction.actionName === "Address" && copyAction.enabled) {
                    hasGeometryDependency = true;
                    break;
                  }
                  //get value from coordinates if it is enabled
                  if (copyAction.actionName === "Coordinates" && copyAction.enabled) {
                    hasGeometryDependency = true;
                    break;
                  }
                }
                if (hasGeometryDependency) {
                  break;
                }
              }
              domAttr.set(this._refreshButton, "hasGeometryDependency", hasGeometryDependency);
              if (hasGeometryDependency) {
                domClass.remove(this._refreshButton, "hidden");
              }
            }
          }
        }
      },

      _refreshAttributes: function () {
        this.loading.show();
        //load all the info required to copy attributes
        this._getCopyAttributes(this.currentLayerInfo, this.currentFeature.geometry).then(
          lang.hitch(this, function (copyAttrInfo) {
            //if fieldValues exist means copy actions are applied
            if (this.currentLayerInfo.fieldValues) {
              //loop through all copy actions and get the values as per priority for individual actions
              for (var fieldName in this.currentLayerInfo.fieldValues) {
                //  array.some(this.currentLayerInfo.fieldValues[fieldName], lang.hitch(this, function (copyAction) {
                for (var i = 0; i < this.currentLayerInfo.fieldValues[fieldName].length; i++) {
                  var copyAction = this.currentLayerInfo.fieldValues[fieldName][i];
                  var foundInIntersection = false, resetToEmpty = true;
                  var value = null;
                  //get value form intersection if it is enabled
                  if (copyAttrInfo && copyAction.actionName === "Intersection" && copyAction.enabled) {
                    for (var j = 0; j < copyAction.fields.length; j++) {
                      var fieldInfo = copyAction.fields[j];
                      if (copyAttrInfo.Intersection.hasOwnProperty(fieldName) &&
                        copyAttrInfo.Intersection[fieldName].hasOwnProperty(fieldInfo.layerId) &&
                        copyAttrInfo.Intersection[fieldName][fieldInfo.layerId].hasOwnProperty(fieldInfo.field)) {
                        value = copyAttrInfo.Intersection[fieldName][fieldInfo.layerId][fieldInfo.field];
                        this._setValuesInDijits(fieldName, value);
                        foundInIntersection = true;
                        resetToEmpty = false;
                        break;
                      }
                    }
                    if (foundInIntersection) {
                      break;
                    }
                  }
                  //get value from address if it is enabled
                  if (copyAttrInfo && copyAction.actionName === "Address" && copyAction.enabled &&
                    copyAttrInfo.Address.hasOwnProperty(copyAction.field)) {
                    value = copyAttrInfo.Address[copyAction.field];
                    this._setValuesInDijits(fieldName, value);
                    resetToEmpty = false;
                    break;
                  }
                  //get value from coordinates if it is enabled
                  if (copyAttrInfo && copyAction.actionName === "Coordinates" && copyAction.enabled) {
                    //If xy is a field store both x y in same field
                    if (copyAction.field === "xy") {
                      value = copyAttrInfo.Coordinates[copyAction.coordinatesSystem].x + " " +
                        copyAttrInfo.Coordinates[copyAction.coordinatesSystem].y;
                    } else {
                      value = copyAttrInfo.Coordinates[copyAction.coordinatesSystem][copyAction.field];
                    }
                    this._setValuesInDijits(fieldName, value);
                    resetToEmpty = false;
                    break;
                  }
                  //get value from preset if it is enabled
                  if (copyAction.actionName === "Preset" && copyAction.enabled && this._usePresetValues) {
                    resetToEmpty = false;
                    break;
                  }
                  //if value not found in any copy action set it to empty(null)
                  if (resetToEmpty && copyAction.enabled &&
                    (copyAction.actionName === "Intersection" ||
                      copyAction.actionName === "Address" ||
                      copyAction.actionName === "Coordinates")) {
                    this._setValuesInDijits(fieldName, null);
                  }
                }
              }
            }
            this.loading.hide();
            //focus out the last dijit so that if it has error wil be notiifed
            setTimeout(function () {
              focusUtil.curNode && focusUtil.curNode.blur();
            }, 100);

          }));
      },

      _setValuesInDijits: function (fieldName, value) {
        var dateVal, dijit;
        dijit = this._getCurrentFieldDijit(fieldName);
        dateVal = null;
        //Case for all field types other than dateTime
        //Else if multiple dijit means the case of date and time
        if (dijit && dijit.set) {
          dijit.set("value", value, true);
          //focus the dijits so that if it has error will get notified
          dijit.focus();
        } else if (dijit && dijit.length > 0) {
          //if values is valid then only get in Date format else set null only
          if (value) {
            dateVal = new Date(value);
          }
          //set date
          if (dijit[0]) {
            dijit[0].set("value", dateVal, true);
          }
          //set time
          if (dijit.length > 1 && dijit[1]) {
            dijit[1].set("value", dateVal, true);
          }
        }
      },
      /* End Refresh attributes on geometry change */

      /**
       * This function to is used to get all the selectable layers
       * and it is passed to the select tool widget. Only those layer needs to be passed whose geomery type matches with the
       * the geomtery type of selected template.
       */
      _getOrClearSelectableLayers: function (clearSelection) {
        var layers, selectionMgr, selectedTemplate, featureLayerObject, selectedGeometryType;
        layers = [];
        if (clearSelection) {
          selectionMgr = SelectionManager.getInstance();
        }
        if (this.templatePicker) {
          selectedTemplate = this.templatePicker.getSelected();
          if (selectedTemplate) {
            featureLayerObject = selectedTemplate.featureLayer;
            selectedGeometryType = featureLayerObject.geometryType;
          }
        }
        for (var layer in this.map._layers) {
          if (this.map._layers.hasOwnProperty(layer)) {
            var layerObj;
            layerObj = this.map._layers[layer];
            if (layerObj.hasOwnProperty("type") &&
              layerObj.type === "Feature Layer") {
              if (clearSelection) {
                selectionMgr.clearSelection(layerObj);
                // consider only those layer for custom select tool widget whose geometryType matches with the geometryType
                // of selectedTemplate.
              } else if (selectedGeometryType &&
                layerObj.hasOwnProperty("geometryType") &&
                layerObj.geometryType === selectedGeometryType) {
                layers.push(layerObj);
              }
            }
          }
        }
        if (!clearSelection) {
          return layers;
        }
      },

      /**
       * This function to fetch selected features from the layers on
       * selection complete by select tool
       */
      _getSelectedFeature: function () {
        var selectionLayerResponse, selectableLayers;
        selectionLayerResponse = [];
        selectableLayers = this._getOrClearSelectableLayers(false);
        array.forEach(selectableLayers, lang.hitch(this, function (layer) {
          selectionLayerResponse = selectionLayerResponse.concat(layer.getSelectedFeatures());
        }));
        return selectionLayerResponse;
      },

      /**
       * This function to is used to initialize select tool widget
       */
      _initializeSelectToolWidget: function () {
        this._selectTool = new FeatureSetChooserForMultipleLayers({
          map: this.map,
          updateSelection: true,
          fullyWithin: false
        });
        this._selectTool.setFeatureLayers(this._getOrClearSelectableLayers(false));
        this.own(on(this._selectTool, 'unloading', lang.hitch(this, function () {
          this.loading.show();
          var selectedFeatures;
          selectedFeatures = this._getSelectedFeature();
          if (selectedFeatures.length === 0) {
            Message({
              message: this.nls.noFeatureSelectedMessage
            });
          } else {
            this._selectTool.deactivate();
            //if copy features instance not found create it
            if (!this._copyFeaturesObj) {
              this._createCopyFeaturesInstance();
            }
            //Pass selected features to selectFeaturesToCopy method,
            //and allow user to choose among selctd features
            this._copyFeaturesObj.selectFeaturesToCopy(selectedFeatures);
            this._setWidgetFirstFocusNode("copyFeatures", true);
            // After selecting feature, copy feature list is created.
            // Since this selection selects the features with default cyan color it needs to be removed or reset it.
            // Hence, as soon as user gets the selected feature remove its selection as list is created and selected features
            // are no longer created.
            this._getOrClearSelectableLayers(true);
            this._displayCopyFeatureDiv();
            this._resetCopyFeatureListHeight();
          }
          this.loading.hide();
        })));
      },

      /**
       * This function is used to set the height of copy feature list depending upon the
       * visibility of single and multiple button.
       */
      _resetCopyFeatureListHeight: function () {
        // node 1
        var copyFeatureTitleContainer = query(".esriCTCopyFeaturesListTitle", this.copyFeaturesMainNode);
        if (copyFeatureTitleContainer && copyFeatureTitleContainer.length > 0) {
          copyFeatureTitleContainer = copyFeatureTitleContainer[0];
        }
        var copyFeatureTitleHeight = domStyle.getComputedStyle(copyFeatureTitleContainer).height;
        copyFeatureTitleHeight = parseFloat(copyFeatureTitleHeight);
        // extra margin(5) that needs to be added
        copyFeatureTitleHeight = copyFeatureTitleHeight + 35;

        // node 2
        var copyFeatureListContentContainer = query(".esriCTCopyFeaturesListContent", this.copyFeaturesMainNode);
        if (copyFeatureListContentContainer && copyFeatureListContentContainer.length > 0) {
          copyFeatureListContentContainer = copyFeatureListContentContainer[0];
        }

        // node 3
        var copyFeatureButtonContentContainer = query(".esriCTCopyFeaturesBtnContainer", this.copyFeaturesMainNode);
        if (copyFeatureButtonContentContainer && copyFeatureButtonContentContainer.length > 0) {
          copyFeatureButtonContentContainer = copyFeatureButtonContentContainer[0];
        }
        var copyFeatureButtonContentContainerHeight = domStyle.getComputedStyle(copyFeatureButtonContentContainer).height;
        copyFeatureButtonContentContainerHeight = parseFloat(copyFeatureButtonContentContainerHeight);

        // node 4
        var copyFeatureMainNodeHeight = domStyle.getComputedStyle(this.copyFeaturesMainNode).height;
        copyFeatureMainNodeHeight = parseFloat(copyFeatureMainNodeHeight);

        // reset height
        var copyFeatureListContentContainerHeight = copyFeatureMainNodeHeight - (copyFeatureTitleHeight + copyFeatureButtonContentContainerHeight);
        domStyle.set(copyFeatureListContentContainer, "height", copyFeatureListContentContainerHeight + "px");
      },

      /**
       * Creates instacne of copy-features dijit which allows user to choose
       * among selected features.
       */
      _createCopyFeaturesInstance: function () {
        this._copyFeaturesObj = new CopyFeatures({
          nls: this.nls,
          layerInfosObj: this._jimuLayerInfos,
          mainNode: this.copyFeaturesMainNode,
          appUtils: this.appUtils,
          map: this.map,
          widgetId: this.widgetId
        }, domConstruct.create("div", {}, this.copyFeaturesMainNode));
        //handle create-single-feature event and display copy asset msg
        this.own(on(this._copyFeaturesObj, "createSingleFeature",
          lang.hitch(this, function (allSelectedFeatures) {
            this.loading.show();
            // clear the selection
            this._copyFeaturesObj.highlightGraphicsLayer.clear();
            // close the copy feature form
            this._hideCopyFeatureDiv();
            // destroy copy feature instance
            this._destroyCopyFeatureInstance();
            // graphic object of a single layer
            var singleFeatureObj = this._createSingleGeometry(allSelectedFeatures);
            // update single feature
            var featureLayerObject = this.templatePicker.getSelected().featureLayer;
            var featureLayerInfo = this._getLayerInfoByID(featureLayerObject.id);
            var singleFeature = this._updateAllSelectedGeometries([singleFeatureObj.graphic], featureLayerInfo, singleFeatureObj.layerObj)[0];
            // if feature selection found
            // in case of single copied feature, add it to graphics layer and allow user to save it
            if (singleFeature) {
              this._addGraphicToLocalLayer(singleFeature, singleFeature.attributes);
            }
          })));
        //handle create-multiple-features event and display copy asset msg
        this.own(on(this._copyFeaturesObj, "createMultipleFeatures",
          lang.hitch(this, function (allSelectedGeometries) {
            this.loading.show();
            // clear the selection
            this._copyFeaturesObj.highlightGraphicsLayer.clear();
            // close the copy feature form
            this._hideCopyFeatureDiv();
            // destroy copy feature instance
            this._destroyCopyFeatureInstance();
            // if feature selection found
            if (allSelectedGeometries && allSelectedGeometries.length > 0) {
              //when only one feature is coiped add it to graphicLayer and allow user to save it.
              //else add all copied features and then show them in AI
              if (allSelectedGeometries.length === 1) {
                // single feature creation
                var featureLayerObject = this.templatePicker.getSelected().featureLayer;
                var featureLayerInfo = this._getLayerInfoByID(featureLayerObject.id);
                var singleFeature = this._updateAllSelectedGeometries(allSelectedGeometries, featureLayerInfo)[0];
                this._addGraphicToLocalLayer(singleFeature, singleFeature.attributes);
              } else {
                this._addSelectedFeatureInTheLayer(allSelectedGeometries);
              }
            }
          })));
        //handle create-multiple-features event and display copy asset msg
        this.own(on(this._copyFeaturesObj, "cancelBtnClicked", lang.hitch(this, function () {
          this._onCopyFeatureCancelButtonClicked();
        })));
        this._copyFeaturesObj.startup();
      },

      /**
       * This function is used to destroy the instance of copy feature and empty its parent container
       */
      _destroyCopyFeatureInstance: function () {
        if (this._copyFeaturesObj) {
          this._copyFeaturesObj.destroy();
          this._copyFeaturesObj = null;
        }
        domConstruct.empty(this.copyFeaturesMainNode);
      },

      /**
       * This function is executed when cancel button
       * in copy feature form is clicked. It is used to perform operations
       * like hide the current form, clear the existing feature selections.
       */
      _onCopyFeatureCancelButtonClicked: function () {
        this._hideCopyFeatureDiv();
        this._changeSelectToolState();
        // destroy copy feature instance
        this._destroyCopyFeatureInstance();
        this._setWidgetFirstFocusNode("templatePicker", true);
      },

      /**
       * This function is used to add features in the layer of selected template.
       * @param {*} allSelectedGeometries features that needs to be added
       */
      _addSelectedFeatureInTheLayer: function (allSelectedGeometries) {
        var selectedFeatureArr = [];
        // While adding features in the layer, attribute must be added and it should be fetched from template-picker
        var selectedTemp = this.templatePicker.getSelected();
        var deferredArray;
        deferredArray = [];
        var featureLayerObject = this.templatePicker.getSelected().featureLayer;
        var featureLayerInfo = this._getLayerInfoByID(featureLayerObject.id);
        allSelectedGeometries = this._updateAllSelectedGeometries(allSelectedGeometries, featureLayerInfo);
        array.forEach(allSelectedGeometries, lang.hitch(this, function (selectedFeatureDetail) {
          var featureDef = this._getCopyAttributes(featureLayerInfo, selectedFeatureDetail.geometry);
          deferredArray.push(featureDef);
          featureDef.then(lang.hitch(this, function (copyAttributesInfo) {
            var selectedFeaturesAttributes = lang.clone(selectedFeatureDetail.attributes);
            var newAttributes = lang.clone(selectedTemp.template.prototype.attributes);
            //copy only those attributes which are not available in template or
            //if the value in template for those attribute is null or
            //override defaults by copied feature is true
            for (var attrKey in selectedFeaturesAttributes) {
              if (!newAttributes.hasOwnProperty(attrKey) || newAttributes[attrKey] === null ||
                this.config.editor.overrideDefaultsByCopiedFeature) {
                newAttributes[attrKey] = selectedFeaturesAttributes[attrKey];
              }
            }
            this._modifyAttributesWithPresetValues(newAttributes, featureLayerInfo, copyAttributesInfo);
            //perform feature creation
            var newGraphic = new Graphic(selectedFeatureDetail.geometry, null, newAttributes);
            // store original attrs for later use
            newGraphic.preEditAttrs = JSON.parse(JSON.stringify(newGraphic.attributes));
            selectedFeatureArr.push(newGraphic);
          }));
        }));
        all(deferredArray).then(lang.hitch(this, function () {
          this.templatePicker.getSelected().featureLayer.applyEdits(selectedFeatureArr, null, null,
            lang.hitch(this, function (results) {
              var featureAddingFailed, objectIdArr, failedCountString;
              featureAddingFailed = 0;
              objectIdArr = [];
              array.forEach(results, lang.hitch(this, function (result) {
                if (result.success) {
                  objectIdArr.push(result.objectId);
                } else {
                  featureAddingFailed++;
                }
              }));
              if (featureAddingFailed > 0) {
                failedCountString = String.substitute(this.nls.addingFeatureErrorCount, {
                  copyFeatureErrorCount: featureAddingFailed
                });
              }
              if (objectIdArr.length === 0 && featureAddingFailed > 0) {
                this.loading.hide();
                Message({
                  message: this.nls.addingFeatureError + " " + failedCountString
                });
              } else if (objectIdArr.length > 0 && featureAddingFailed > 0) {
                Message({
                  message: failedCountString
                });
                this._selectFeaturesInTheLayer(objectIdArr);
              } else {
                this._selectFeaturesInTheLayer(objectIdArr);
              }
            }), lang.hitch(this, function (error) {
              this.loading.hide();
              Message({
                message: this.nls.addingFeatureError + " " + error.message
              });
            }));
        }), lang.hitch(this, function (error) {
          this.loading.hide();
          Message({
            message: this.nls.addingFeatureError + " " + error.message
          });
        }));
      },

      /**
       * This function is used to activate/de-activate custom select tool.
       */
      _changeSelectToolState: function () {
        this._getOrClearSelectableLayers(true);
        if (this.currentDrawType === "SELECT" &&
          this.templatePicker &&
          this.templatePicker.getSelected() &&
          this._selectTool) {
          this._selectTool.activate();
        } else {
          if (this._selectTool && this._selectTool.isActive()) {
            this._selectTool.deactivate();
          }
        }
        //After deactivating select tool infowindow gets enabled
        //so disable it in any case when any of the tool is activated
        this.map.setInfoWindowOnClick(false);
      },

      /**
       * This function is used to add the options in menuitem &
       * menuitem into menu object
       */
      _addMenuItem: function (options, menu, drawingOption) {
        options = lang.mixin(options, {
          onClick: lang.hitch(this, this._drawingToolClick(drawingOption, options))
        });
        var menuItem = new MenuItem(options);
        menu.addChild(menuItem);
      },

      /**
       * This function is used to hide copy feature div
       */
      _hideCopyFeatureDiv: function () {
        //hide copy features div
        domClass.add(this.copyFeaturesMainNode, "esriCTHidden");
        //show telmpatepicker div
        query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "block";
        //after hiding when we show template picker sometimes it becomes empty, hence update it
        if (this.templatePicker) {
          this.templatePicker.update();
        }
      },

      /**
       * This function is used to display copy feature div
       */
      _displayCopyFeatureDiv: function () {
        //hide telmpatepicker div
        query(".jimu-widget-smartEditor .templatePickerMainDiv")[0].style.display = "none";
        //show copy features div
        domClass.remove(this.copyFeaturesMainNode, "esriCTHidden");
      },

      /**
       * This function merge all the geometries and create only one single geometry.
       */
      _createSingleGeometry: function (allSelectedFeatures) {
        var singleFeature, geometryType;
        geometryType = allSelectedFeatures[0]._layer.geometryType;
        if (geometryType === "esriGeometryPolyline") {
          singleFeature = this._createSinglePolyline(allSelectedFeatures);
        } else if (geometryType === "esriGeometryPolygon") {
          singleFeature = this._createSinglePolygon(allSelectedFeatures);
        }
        // needed to create a new graphic, so that its type property can be accessed in further functions
        return {
          "graphic": new Graphic(singleFeature, null, allSelectedFeatures[0].attributes),
          "layerObj": allSelectedFeatures[0].getLayer()
        }
      },

      /**
       * Creates only one sigle polyline form muitple features
       */
      _createSinglePolyline: function (allSelectedFeatures) {
        var polyline;
        polyline = new Polyline(
          new SpatialReference(allSelectedFeatures[0].geometry.spatialReference));
        array.forEach(allSelectedFeatures, lang.hitch(this, function (feature) {
          if (feature.geometry && feature.geometry.paths) {
            array.forEach(feature.geometry.paths, function (path) {
              polyline.addPath(path);
            });
          }

        }));
        return polyline;
      },

      /**
       * Creates only one sigle polygon form muitple features
       */
      _createSinglePolygon: function (allSelectedFeatures) {
        var polygon;
        polygon = new Polygon(
          new SpatialReference(allSelectedFeatures[0].geometry.spatialReference));
        array.forEach(allSelectedFeatures, lang.hitch(this, function (feature) {
          if (feature.geometry && feature.geometry.rings) {
            array.forEach(feature.geometry.rings, function (ring) {
              polygon.addRing(ring);
            });
          }
        }));
        return polygon;
      },

      /**
       * Once the features are selected and user clicks on create single/multiple feature button.
       * The features are added on the map. Its object ids are fetched and this features are selected in the layer.
       * @param {*} objectIdArr object id of the features that needs to be selected.
       */
      _selectFeaturesInTheLayer: function (objectIdArr) {
        var featureLayerInfo, featureLayerObject;
        featureLayerObject = this.templatePicker.getSelected().featureLayer;
        featureLayerInfo = this._getLayerInfoByID(featureLayerObject.id);
        this.map.infoWindow.hide();
        //Destroy all prev attributeInspectors
        array.forEach(this._attributeInspectorCollection, function (attributeInspector) {
          attributeInspector.destroy();
        });
        //reset array
        this._traversal = [];
        this._nodesCollection = [];
        this._paginationNodeCollection = [];
        this._buttonsWrapper = [];
        this._attributeInspectorCollection = [];
        this._relatedTablesInfo = {};
        // recreate the attr inspector if needed
        this._createAttributeInspector([featureLayerInfo], true, featureLayerObject);
        var layers = this.map.getLayersVisibleAtScale().filter(lang.hitch(this, function (lyr) {
          if (lyr.type && lyr.type === "Feature Layer" && lyr.url) {
            return array.some(this.config.editor.configInfos, lang.hitch(this, function (configInfo) {
              if (configInfo.layerId === lyr.id &&
                this._hasAnyEditableLayerInRelation([configInfo])) {
                return true;
              } else {
                return false;
              }
            }));
          } else {
            return false;
          }
        }));
        //remove no visible layers, for some reason the function above returns true
        layers = layers.filter(lang.hitch(this, function (lyr) {
          try {
            return this.map.getLayer(lyr.id).visible;
          } catch (ex) {
            console.log(ex + " Check for visible failed");
            return true;
          }
        }));
        var updateFeatures = [];
        this.currentFeature = null;
        this.geometryChanged = false;
        this.currentLayerInfo = null;
        // Query creation
        var selectQuery = new Query();
        var uniqueValue = Date.now();
        selectQuery.objectIds = objectIdArr;
        selectQuery.where = uniqueValue + " = " + uniqueValue;
        selectQuery.outFields = ["*"];
        // Selecting features in the layer
        featureLayerObject.selectFeatures(
          selectQuery,
          FeatureLayer.SELECTION_NEW,
          lang.hitch(this, function (features) {
            var validFeatures = [];
            array.forEach(features, function (feature) {
              var featureValid = true;
              feature.allowDelete = true;
              //The below is the preferred way, but this fails on public services and the user is logged in
              if (!featureLayerObject.getEditCapabilities({
                feature: feature
              }).canDelete) {
                feature.allowDelete = false;
              }
              if (featureValid === true) {
                feature.preEditAttrs = JSON.parse(JSON.stringify(feature.attributes));
                validFeatures.push(feature);
              }
            }, this);
            updateFeatures = updateFeatures.concat(validFeatures);
            if (updateFeatures.length > 0) {
              this.updateFeatures = updateFeatures;
              // When 'Remove feature from selection..' is checked, attribute inspector was displayed while copying features.
              // This won't happen when new feature is created. It stays on template picker page only.
              // To make this same behaviour while copying feature we need to check below condition.
              // If its false, then show attribute inspector, else stay on template picker page and clear all the existing selection.
              if (!this.config.editor.removeOnSave) {
                this._showTemplate(false);
              } else {
                if (this.templatePicker) {
                  this.templatePicker.clearSelection();
                }
                this.loading.hide();
              }
            }
          }), lang.hitch(this, function () {
            Message({
              message: this.nls.selectingFeatureError
            });
          }));
      },

      /**
       * This function is used to add label to the custom select option. It is added over here,
       * since the text of the label needs to be fetched from nls.
       */
      _updatedDrawingOptions: function () {
        for (var property in SEDrawingOptions) {
          array.forEach(SEDrawingOptions[property], lang.hitch(this, function (option, index) {
            if (option.hasOwnProperty("_drawType") && option._drawType === "SELECT") {
              SEDrawingOptions[property][index].label = this.nls.customSelectOptionLabel;
            }
          }));
        }
      },

      /**
       * This function is used to de-activate the tools when template selection is changed
       */
      _deactivateAllTools: function () {
        if (this.drawToolbar) {
          this.drawToolbar.deactivate();
        }
        if (this._selectTool) {
          this._selectTool.deactivate();
        }
      },

      /**
       * This function is used to check whether each field of each selected feature is present in
       * target & source layer info. If Yes, whether its datatype is matched. If Yes, only consider
       * those attributes and update the list of selected features.
       */
      _updateAllSelectedGeometries: function (allSelectedGeometries, targetLayerInfo, sourceLayerDetails) {
        var updatedFeatures = [];
        var targetInfoObj = this._getInfoDetails(targetLayerInfo);
        array.forEach(allSelectedGeometries, lang.hitch(this, function (selectedFeature) {
          var sourceLayer = selectedFeature.getLayer();
          if (sourceLayer === null || sourceLayer === "" || sourceLayer === undefined) {
            sourceLayer = sourceLayerDetails;
          }
          var sourceInfo = this._getLayerInfoByID(sourceLayer.id);
          var sourceInfoObj = this._getInfoDetails(sourceInfo);
          var finalAttributeObj;
          finalAttributeObj = {};
          for (var attr in selectedFeature.attributes) {
            var keyInLowerCase = attr.toLowerCase();
            if (targetInfoObj.hasOwnProperty(keyInLowerCase) &&
              sourceInfoObj.hasOwnProperty(keyInLowerCase) &&
              targetInfoObj[keyInLowerCase].type === sourceInfoObj[keyInLowerCase].type) {
              finalAttributeObj[targetInfoObj[keyInLowerCase].name] = lang.clone(selectedFeature.attributes[attr]);
            }
          }
          updatedFeatures.push(new Graphic(selectedFeature.geometry, null, finalAttributeObj));
        }));
        return updatedFeatures;
      },

      /**
       * This function is used to get the object which has a key value pair of field name & its datatype,
       * and this is created from info of the layer which is passed as a parameter.
       */
      _getInfoDetails: function (layerInfo) {
        var infoObj;
        infoObj = {};
        array.forEach(layerInfo.fieldInfos, lang.hitch(this, function (fieldInfo) {
          infoObj[fieldInfo.name.toLowerCase()] = {
            name: fieldInfo.name,
            type: fieldInfo.type
          };
        }));
        return infoObj;
      },

      /**********************
      * Code to support 508
      **********************
      */
      _setWidgetFirstFocusNode: function (screen, isFocusRequired) {
        var nodeObj = this._getFirstAndLastFocusNode(screen);
        if (!nodeObj.firstNode || !nodeObj.lastNode) {
          return;
        }
        utils.initFirstFocusNode(this.domNode, nodeObj.firstNode);
        utils.initLastFocusNode(this.domNode, nodeObj.lastNode);
        if (isFocusRequired) {
          utils.focusFirstFocusNode(this.domNode);
        }
      },

      _getFirstAndLastFocusNode: function (screen) {
        var nodeObj = {};
        if (screen === "templatePicker") {
          nodeObj.firstNode = this._getFirstFocusNodeForTemplatePickerScreen();
          nodeObj.lastNode = this._getLastFocusNodeForTemplatePickerScreen();
        }
        else if (screen === "AI") {
          if (this.attrInspector && this.attrInspector.attributeTable) {
            //Loop through all the attribute inspector fields and make sure all the disabled
            //atrributes are repalced with read only attribtues
            var node, listContainer, tabindexForControls;
            node = registry.findWidgets(this.attrInspector.attributeTable);
            if (this.attrInspector.domNode.parentElement &&
              this.attrInspector.domNode.parentElement.parentElement) {
              listContainer = query(".esriCTItemContent",
                this.attrInspector.domNode.parentElement.parentElement);
              if (listContainer && listContainer.length > 0) {
                if (domClass.contains(listContainer[0], "esriCTItemContentActive")) {
                  tabindexForControls = "0";
                } else {
                  tabindexForControls = "-1";
                }
              }
              this._setTabIndexToListItems(null, false, tabindexForControls);
            }
            array.forEach(node, lang.hitch(this, function (node) {
              if (node.focusNode && domAttr.get(node.focusNode, "disabled")) {
                domAttr.set(node.focusNode, "disabled", false);
                domAttr.set(node.focusNode, "readonly", true);
              }
              //Set aria-labels to all the controls
              if (node.focusNode && node.domNode.parentElement &&
                node.domNode.parentElement.parentElement) {
                var label = query(".atiLabel", node.domNode.parentElement.parentElement);
                if (label && label[0]) {
                  var fieldLabel = label[0].innerHTML;
                  //if field is required then skip the html text from being used in aria-label
                  //and set aria-required property to true
                  if (fieldLabel.indexOf('<a class="asteriskIndicator"> *</a>') >= 0) {
                    fieldLabel = fieldLabel.replace('<a class="asteriskIndicator"> *</a>', '');
                    domAttr.set(node.focusNode, "aria-required", "true");
                  } else if (fieldLabel.indexOf('<span class="atiRequiredField"> *</span>') >= 0) {
                    fieldLabel = fieldLabel.replace('<span class="atiRequiredField"> *</span>', '');
                    domAttr.set(node.focusNode, "aria-required", "true");
                  } else {
                    domAttr.set(node.focusNode, "aria-required", "false");
                  }
                  domAttr.set(node.focusNode, "aria-label", fieldLabel);
                }
              }
            }));
          }
          nodeObj.firstNode = this._getFirstFocusNodeForAttributeInspectorScreen();
          nodeObj.lastNode = this._getLastFocusNodeForAttributeInspectorScreen();
        } else if (screen === "copyFeatures") {
          nodeObj = this._getFirstAndLastFocusNodeForCopyFeaeturesScreen();
        }
        return nodeObj;
      },

      _getFirstFocusNodeForTemplatePickerScreen: function () {
        var firstNode;
        //Check if display preset option is configured to display at top
        if (this.config.editor.hasOwnProperty("displayPresetTop") &&
          this.config.editor.displayPresetTop === true &&
          domStyle.get(this.presetFieldsTableDiv, "display") === "block") {
          firstNode = registry.byId("savePresetValueSwitch").domNode;
        } else {
          //Decription is dispalyed it will be the first node
          if (domStyle.get(this.templateTitle, "display") === "block") {
            firstNode = this.templateTitle;
          } else if (this.config.editor.useFilterEditor) {
            //If filter editor is enabled, set its dom node as the first focus node
            firstNode = this._filterEditor.selectDropDown;
            //If filter display shape selector is enabled and copy featues is enabled,
            //set its dom node as the first focus node
          } else if (this.config.editor.displayShapeSelector === true ||
            (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") &&
              (this.config.editor.createNewFeaturesFromExisting === true))) {
            firstNode = this.drawingTool.focusNode;
            //If auto save functionality is enabled,
            //set its dom node as the first focus node
          } else if (this.config.editor.autoSaveEdits) {
            firstNode = registry.byId("autoSaveSwitch").domNode;
            //If preset table is enable,
            //set its dom node as the first focus node
          } else if (domStyle.get(this.presetFieldsTableDiv, "display") === "block") {
            firstNode = registry.byId("savePresetValueSwitch").domNode;
          }
        }
        return firstNode;
      },

      _getLastFocusNodeForTemplatePickerScreen: function () {
        var lastNode;
        //Check if display preset option is configured to display at botto,
        if (this.config.editor.hasOwnProperty("displayPresetTop") &&
          this.config.editor.displayPresetTop === false &&
          domStyle.get(this.presetFieldsTableDiv, "display") === "block") {
          //If preset is enabled,
          //check for all the preset groups
          //and accordingly set the last focus node
          var presetValueTable = query("#eePresetValueBody")[0];
          if (presetValueTable) {
            var inputElements = query(".preset-value-editable .ee-inputField");
            inputElements.reverse();
            array.some(inputElements, lang.hitch(this, function (ele) {
              if (!domClass.contains(ele.parentElement.parentElement, "esriCTHidden")) {
                if (ele.parentElement.children.length > 1) {
                  lastNode = ele.parentElement.children[1];
                } else {
                  lastNode = ele;
                }
                return true;
              }
            }));
          }
          //If all the preset groups are hidden
          //then set the last node as preset checkbox node
          if (!lastNode) {
            lastNode = registry.byId("savePresetValueSwitch").domNode;
          }
        } else if (this.config.editor.autoSaveEdits && !this._creationDisabledOnAll) {
          lastNode = registry.byId("autoSaveSwitch").domNode;
          //If preset table is enable,
          //set its dom node as the last focus node
        } else if ((this.config.editor.displayShapeSelector === true ||
          (this.config.editor.hasOwnProperty("createNewFeaturesFromExisting") &&
            (this.config.editor.createNewFeaturesFromExisting === true))) &&
          !this._creationDisabledOnAll) {
          lastNode = this.drawingTool.focusNode;
          //If auto save functionality is enabled,
          //set its dom node as the last focus node
        } else if (this.config.editor.useFilterEditor && !this._creationDisabledOnAll) {
          lastNode = this._filterEditor.filterTextBox;
          //If filter display shape selector is enabled and copy featues is enabled,
          //set its dom node as the last focus node
        } else if (domStyle.get(this.templateTitle, "display") === "block") {
          //Decription is dispalyed it will be the last node
          lastNode = this.templateTitle;
        } else if (domStyle.get(this.presetFieldsTableDiv, "display") === "block") {
          //Check if preset is enabled
          //accodingly set the last  focus node
          var presetValueTable = query("#eePresetValueBody")[0];
          if (presetValueTable) {
            var inputElements = query(".preset-value-editable .ee-inputField");
            inputElements.reverse();
            array.some(inputElements, lang.hitch(this, function (ele) {
              if (!domClass.contains(ele.parentElement.parentElement, "esriCTHidden")) {
                if (ele.parentElement.children.length > 1) {
                  lastNode = ele.parentElement.children[1];
                } else {
                  lastNode = ele;
                }
                return true;
              }
            }));
          }
          if (!lastNode) {
            lastNode = registry.byId("savePresetValueSwitch").domNode;
          }
        }
        return lastNode;
      },

      _getFirstFocusNodeForAttributeInspectorScreen: function () {
        var firstNode;
        //Check the position of action buttons
        if (this.config.editor.showActionButtonsAbove) {
          firstNode = this.cancelButton;
        } else {
          //Check number of features in current Attribute Inspector
          if (this.attrInspector._numFeatures === 1) {
            var itemNode, layerDescriptionNode;
            itemNode = query(".esriCTItem", this.contentWrapper);
            layerDescriptionNode = query(".editDescription", this.contentWrapper);
            //If only one feature is found and no related features are present then
            //set focus to items list node as a first focus node
            //else set first control as the firs node in AI
            if (itemNode && itemNode.length > 0 &&
              !domClass.contains(itemNode[0], "esriCTDisableToggling")) {
              firstNode = itemNode[0].children[0];
            } else if (layerDescriptionNode && layerDescriptionNode.length > 0) {
              firstNode = layerDescriptionNode[0];
            }
            else if (this.attrInspector && this.attrInspector.attributeTable) {
              var nodes = registry.findWidgets(this.attrInspector.attributeTable);
              array.some(nodes, lang.hitch(this, function (node) {
                if (node.focusNode &&
                  !domClass.contains(node.domNode.parentElement.parentElement, "hideField")) {
                  firstNode = node.focusNode;
                  return true;
                }
              }));
              //If attachment editor form control is enabled
              if (!firstNode && this.attrInspector._attachmentEditor &&
                domStyle.get(this.attrInspector._attachmentEditor.domNode, "display") === "block") {
                var attachmentList = this.attrInspector._attachmentEditor._attachmentList.childNodes;
                if (attachmentList && attachmentList.length > 0) {
                  firstNode = attachmentList.children[0];
                } else if (!firstNode) {
                  if (this.attrInspector._attachmentEditor._uploadForm &&
                    domStyle.get(this.attrInspector._attachmentEditor._uploadForm, "display") === "block") {
                    firstNode = this.attrInspector._attachmentEditor._uploadForm;
                  }
                }
              }
              //If attachment uplaoder form control is enabled
              if (!firstNode && this.attrInspector._attachmentUploader &&
                this.attrInspector._attachmentUploader.attachmentUploader) {
                var uplaoderFirstNode;
                uplaoderFirstNode =
                  query("form", this.attrInspector._attachmentUploader.attachmentUploader);
                if (uplaoderFirstNode && uplaoderFirstNode.length > 0) {
                  uplaoderFirstNode = uplaoderFirstNode[0];
                  if (domStyle.get(uplaoderFirstNode.children[0], "display") !== "none") {
                    firstNode = uplaoderFirstNode.children[0];
                  } else {
                    firstNode = uplaoderFirstNode.children[1];
                  }
                }
              }
              //If all the fields in the AI are disabled or displayed off
              if (this._traversal.length < 2 && this._editGeomSwitch.domNode &&
                !firstNode && domStyle.get(this._editGeomSwitch.domNode.parentNode, "display") === "block") {
                firstNode = this._editGeomSwitch.domNode;
              }
              //If all the fields inside AI are disabled and edit geo switch is disabled
              if (!firstNode) {
                firstNode = this.cancelButton;
              }
            }
          } else if (this.attrInspector._numFeatures > 1) {
            //If more then one feature is present in AI,
            //first nav button as the first focus node
            var navButtonWidgets = registry.findWidgets(this.attrInspector.navButtons);
            firstNode = navButtonWidgets[0].focusNode;
          }
        }
        return firstNode;
      },

      _getLastFocusNodeForAttributeInspectorScreen: function () {
        var lastNode;
        //If action buttons acre configured to show at the bottom
        //then check for the last node in buttons container
        if (!this.config.editor.showActionButtonsAbove) {
          var saveBtn = query(".saveButton", this.buttonHeader)[0];
          if (domClass.contains(saveBtn, "jimu-state-disabled")) {
            //if delete button is displayed then it will be the last node else cancle button
            var deleteButton = query(".deleteButton", this.buttonHeader);
            if (deleteButton.length > 0) {
              deleteButton = deleteButton[0];
              if (domStyle.get(deleteButton, "display") === "block") {
                lastNode = deleteButton;
              } else {
                lastNode = this.cancelButton;
              }
            } else {
              lastNode = this.cancelButton;
            }
          } else {
            lastNode = saveBtn;
          }
        }
        //Check if related layer item exist and it is open
        //then set the last node in related item list
        var relatedTitleContainer, detailsContainer, relatedItemDOM;
        detailsContainer = query(".detailsContainer", this.mainContainer);
        detailsContainer = array.filter(detailsContainer, function (item) {
          if (!domClass.contains(item, "hidden"))
            return item;
        })
        relatedItemDOM = query(".esriCTRelatedItemContent", detailsContainer[0]);
        if (!lastNode && relatedItemDOM && relatedItemDOM.length > 0) {
          if (domClass.contains(relatedItemDOM[0], "esriCTItemContentActive")) {
            lastNode = query(".esriCTLastRelatedItem", relatedItemDOM[0])[0];
          } else {
            relatedTitleContainer = query("[isrelateditem=true]", this.mainContainer);
            if (relatedTitleContainer && relatedTitleContainer.length > 0) {
              lastNode = relatedTitleContainer[relatedTitleContainer.length - 1];
            }
          }
        }
        //Check if the actions buttons are enabled
        //then set the last node
        if (!lastNode) {
          var actionButtons;
          actionButtons = query(".esriCTActionButtons", this.attrInspector.domNode);
          array.forEach(actionButtons, lang.hitch(this, function (button) {
            if (domStyle.get(button, "display") === "block") {
              lastNode = button;
            }
          }));
        }
        //If geometery edit switch is enabled
        //then set last focus node to the domnode of geometry eidt switch
        if (this._traversal.length < 2 && this._editGeomSwitch.domNode &&
          !lastNode && domStyle.get(this._editGeomSwitch.domNode.parentNode, "display") === "block") {
          lastNode = this._editGeomSwitch.domNode;
        }
        //If attachment upload form control is enabled
        //then last focus node to upload form control
        if (!lastNode && this.attrInspector._attachmentEditor &&
          domStyle.get(this.attrInspector._attachmentEditor.domNode, "display") === "block") {
          if (this.attrInspector._attachmentEditor._uploadForm &&
            domStyle.get(this.attrInspector._attachmentEditor._uploadForm, "display") === "block") {
            lastNode = this.attrInspector._attachmentEditor._uploadForm;
          } else {
            //If upload form is disabled and attachments are shown
            //then set the last attachment node as last attachment
            var attachmentList = this.attrInspector._attachmentEditor._attachmentList.childNodes;
            if (attachmentList && attachmentList.length > 0) {
              var lastAttachmentNode = attachmentList[attachmentList.length - 1];
              if (domStyle.get(lastAttachmentNode.children[1], "display") === "block") {
                lastNode = lastAttachmentNode.children[1]
              } else {
                lastNode = lastAttachmentNode.children[0];
              }
            }
          }
        }
        //Loop through all the widget controls in AI
        //then set the last focus node accordingly
        if (!lastNode && this.attrInspector && this.attrInspector.attributeTable) {
          var nodes = registry.findWidgets(this.attrInspector.attributeTable);
          nodes.reverse();
          array.some(nodes, lang.hitch(this, function (node) {
            if (node.focusNode &&
              !domClass.contains(node.domNode.parentElement.parentElement, "hideField")) {
              lastNode = node.focusNode;
              return true;
            }
          }));
        }
        //Check if more than one featurs are present
        //then set the last focus node
        if (!lastNode && this.attrInspector._numFeatures > 1) {
          //If more then one feature is present in AI,
          //first nav button as the first focus node
          var navButtonWidgets = registry.findWidgets(this.attrInspector.navButtons);
          lastNode = navButtonWidgets[navButtonWidgets.length - 1].focusNode;
        }
        //Check position of save and clear button and set the last focus node
        //then set the last focus node accordingly
        if (!lastNode && this.config.editor.showActionButtonsAbove) {
          var saveBtn = query(".saveButton", this.buttonHeader)[0];
          if (domClass.contains(saveBtn, "jimu-state-disabled")) {
            lastNode = this.cancelButton;
          } else {
            lastNode = saveBtn;
          }
        }
        return lastNode;
      },

      _getFirstAndLastFocusNodeForCopyFeaeturesScreen: function () {
        return {
          "firstNode": this._copyFeaturesObj.warningMessage,
          "lastNode": this._copyFeaturesObj.cancelBtn
        };
      }
    });
  });