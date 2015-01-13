/**
  *  Gradebook data grid
  *
  *  PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
  *
  *  Copyright 2005 Sabre Airline Solutions
  *
  *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
  *  file except in compliance with the License. You may obtain a copy of the License at
  *
  *         http://www.apache.org/licenses/LICENSE-2.0
  *
  *  Unless required by applicable law or agreed to in writing, software distributed under the
  *  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
  *  either express or implied. See the License for the specific language governing permissions
  *  and limitations under the License.
  *
  *  @author "Bill Richard"
  *  @version $Revision: #9 $ $Date: 2007/02/12 $
  *
  *
  **/

// Gradebook.GridModel -----------------------------------------------------

Gradebook.GridModel = Class.create();

Gradebook.GridModel.prototype = {

	initialize: function(gradebookService) {
   		this.gradebookService = gradebookService;
		this.courseId = gradebookService.courseId;
		this.rows = new Array();
		this.colDefs = new Array();
		this.colOrderMap = new Array();
		this.customViews = new Array();
		this.listeners = new Array();
		this.accessibleMode = false;
		this.resizingWindow = false;
	},

	getCustomViews: function() {
		this.customViews.sort(
			function(a,b){
				var aa = a.name.toLowerCase();
				var bb = b.name.toLowerCase();
				if (aa == bb) return 0;
				else if (aa < bb) return -1;
				else return 1;
			}
		);
		return this.customViews;
	},
	
	// notify registered listeners that model data has changed
	fireModelChanged: function() {
		for (var i = 0; i < this.listeners.length; i++){
			this.listeners[i].modelChanged();
		}
	},

	// notify registered listeners that model error has occured
	fireModelError: function(msg, serverReply) {
		for (var i = 0; i < this.listeners.length; i++){
			if (this.listeners[i].modelError){
				this.listeners[i].modelError(msg, serverReply);
			}
		}
	},

	addModelListener: function(listener) {
		this.listeners.push(listener);
	},

	removeModelListeners: function() {
		this.listeners = new Array();
	},

	updateGrade: function( newValue, newTextValue, userId, colDefId) {
		this.gradebookService.updateGrade((this.updateGradeCallback).bind(this), this.version, newValue, newTextValue, userId, colDefId);
	},

	deleteColumn: function(colDefId) {
		this.gradebookService.deleteColumn(colDefId);
	},

	modifyColumn: function(colDefId, colType) {
		this.gradebookService.modifyColumn(colDefId, colType);
	},
	
	
	viewItemStats: function(itemId) {
		this.gradebookService.viewItemStats(itemId);
	},

	viewStudentStats: function(userId) {
		this.gradebookService.viewStudentStats(userId);
	},
	
	viewAdaptiveRelease: function(userName) {
		this.gradebookService.viewAdaptiveRelease(userName);
	},
	
	hideColumn: function(colDefId) {
		this.gradebookService.hideColumn(colDefId);
	},

	showGradeDetails: function(userId, colDefId){
		this.gradebookService.showGradeDetails( userId, colDefId );
	},

	onAddComment: function(userId, colDefId){
		this.gradebookService.loadComments( userId, colDefId, "studentComments", "instructorComments" );
	},
	
  exemptGrade: function(userId, colDefId){
		this.gradebookService.setExemption( (this.updateGradeCallback).bind(this), this.version, userId, colDefId, true );
	},

  clearExemption: function(userId, colDefId){
		this.gradebookService.setExemption( (this.updateGradeCallback).bind(this), this.version, userId, colDefId, false );
	},

	setComments: function(userId, colDefId, studentComments, instructorComments){
		this.gradebookService.setComments( userId, colDefId, studentComments, instructorComments );
	},
		
	getRowByUserId: function(userId) {
		var rows = this.rows;
		for (var i = 0, len = rows.length; i < len; i++){
			if (rows[i][0].getUserId() == userId) return rows[i];
		}
		return null;
	},
	
	_getGradesForItemId: function(itemId, includeUnavailable) {
		var grades = new Array()
		var colIndex = this.colDefMap[itemId];
		if (colIndex == undefined){
			GradebookUtil.error('GridModel _getGradesForItemId contains data for invalid column id: '+itemId);
			return grades;
		}
		var rows = this.rows;
		for (var i = 0, len = rows.length; i < len; i++){
			var grade = rows[i][colIndex];
			if (includeUnavailable || grade.isAvailable()){
				grades.push( grade );
			}
		}
		return grades;
	},

	updateGradeCallback: function(retData) {
		if (!retData || retData.length == 0){
			GradebookUtil.error('GridModel error updating grade');
			return;
		}
		for (var i = 0, len = retData.length; i < len; i++)
		{
			var data = retData[i];
			var colDefId = data.itemId;
			var userId = data.courseUserId;
			var score = data.score;
			var textInput = data.textInput;
			var row = this.getRowByUserId(userId);
			var colIndex = this.colDefMap[colDefId];
			if (colIndex == undefined){
				// ignore
				continue;
			}
			var gridCell = row[colIndex];
			gridCell.tv = textInput;
			if (textInput.length == 0 && score == 0){
				gridCell.v = '-';
			} else {
				gridCell.v = score;
			}
			gridCell.gc = (data.modified)?"y":null;
			gridCell.or = (data.override)?"y":null;
			gridCell.x = (data.exempt)?"y":null;
			gridCell.mp = data.points;
			gridCell.isUncommitted = false;
			var savingDiv = gridCell.savingDiv;
			if (savingDiv && savingDiv.timerExpired && savingDiv.parentNode){
				savingDiv.style.display = 'none';
				savingDiv.parentNode.removeChild(savingDiv);
				gridCell.savingDiv = null;
			}		
		}
		this.fireModelChanged();
	},

	// called to load model with server data 
	requestLoadData: function() {
		GradebookUtil.debug('GridModel requestLoadData called');
		this.lastUpdateTS = new Date().getTime();
		this.gradebookService.requestLoadData(
					(this._loadDataFromJSON).bind(this),
					(this._reportError).bind(this),
					(this._reportException).bind(this));
	},

	// called to update model with server data 
	requestUpdateData: function() {
		var timeSinceLastUpdate = new Date().getTime() - this.lastUpdateTS;
		// don't update if window is resizing and we've resized in the last 5 minutes
		if (this.resizingWindow && ( timeSinceLastUpdate < 5*60*1000) ){
			this.fireModelChanged();
			return; 
		}
		this.lastUpdateTS = new Date().getTime();
		GradebookUtil.debug('GridModel requestUpdateData called');
		var customViewId = null;
		if (this.currentCustomView && this.currentCustomView.usesGroups()){
			customViewId = this.currentCustomView.id;
		}
		this.gradebookService.requestUpdateData(this.version, this.lastUserChangeTS, this.usersHash, customViewId,
					(this._updateDataFromJSON).bind(this),
					(this._reportError).bind(this),
					(this._reportException).bind(this));
	},

	setResizingWindow: function(f) {
		this.resizingWindow = f;
	},

	getResizingWindow: function() {
		return this.resizingWindow;
	},

	_reportException: function(e) {
		GradebookUtil.error('exception getting data from server: '+ e.message);
	},

	_reportError: function(t) {
		GradebookUtil.error('error getting data from server: '+ t.status + ' -- ' + t.statusText);
	},

	// callback when initializing this gradebook model with server data
	_loadDataFromJSON: function(reply) {
		GradebookUtil.debug('GridModel _loadDataFromJSON called');
		try {
			var jsonBook = eval('(' + reply.responseText + ')');
		} catch (e) {
			this.fireModelError(e.message, reply.responseText);
			return;
		}
		try {
			this.schemaMap = new Array();
			for (var i = 0; i < jsonBook.schemas.length; i++){
				jsonBook.schemas[i] = this._createSchema(jsonBook.schemas[i].type, jsonBook.schemas[i]);
				this.schemaMap[jsonBook.schemas[i].id] = jsonBook.schemas[i];
			}
			this.colDefMap = new Array();
			for (var i = 0; i < jsonBook.colDefs.length; i++){
				jsonBook.colDefs[i] = this._createColDef( jsonBook.colDefs[i], this, this.schemaMap );
				this.colDefMap[jsonBook.colDefs[i].id] = i;
			}
			for (var i = 0; i < jsonBook.rows.length; i++){
				jsonBook.rows[i] = this._loadRowDataFromJSON(jsonBook.rows[i], jsonBook.colDefs, this.colDefMap);
			}
			this.customViewMap = new Array();
			if (jsonBook.customViews){
				for (var i = 0; i < jsonBook.customViews.length; i++){
					jsonBook.customViews[i] = new Gradebook.CustomView( jsonBook.customViews[i], this );
					this.customViewMap[jsonBook.customViews[i].id] = i;
				}
			}
			this.groupsMap = new Array();
			if (jsonBook.groups){
				for (var i = 0; i < jsonBook.groups.length; i++){
					this.groupsMap[jsonBook.groups[i].id] = i;
				}
			}
            this._buildCategoryNameMap( jsonBook );
			Object.extend(this, jsonBook); // assign json properties to this object
   			this._buildGradingPeriodMap();

			if ( this.customViewIdParam != null && this.customViewIdParam.length > 0 ) {
				this._internalChangeCurrentView( 'cv_' + this.customViewIdParam );
			} else if (this.defCVID) {
				this._internalChangeCurrentView( 'cv_' + this.defCVID );
			} else if (this.defGPID){
				this._internalChangeCurrentView( this.defGPID );
			}
			
			this._setStudentInfoLayout();
			this._updateVisibleRows(jsonBook);
			this.sortColumns();
			if (this.colDefMap['LN'] != undefined){
				this.sortColumnId = 'LN';
				this.sortDir = 'ASC';
				this.reSort();
			}
			this.fireModelChanged();
		} catch (e) {
			this.fireModelError(e);
		}
	},
	
	// callback when updating this gradebook model with server data
	_updateDataFromJSON: function(reply) {
		GradebookUtil.debug('GridModel _updateDataFromJSON called');
		try {
			var jsonBook = eval('(' + reply.responseText + ')');
		} catch (e) {
			this.fireModelError(e.message, reply.responseText);
			return;
		}
		try {
			// need to reinitialize if new users added to pick up existing grades
			// when a user is re-enabled
			if (this._hasNewUsers(jsonBook)) {
				this.requestLoadData();
				return;
			}
			this.version = jsonBook.version;
			this.lastUserChangeTS = jsonBook.lastUserChangeTS;
			this.usersHash = jsonBook.usersHash;
			this.numFrozenColumns = jsonBook.numFrozenColumns;
			this.gradingPeriods = jsonBook.gradingPeriods;
			this.categories = jsonBook.categories;
			this._buildCategoryNameMap( jsonBook );
			this.studentInfoLayouts = jsonBook.studentInfoLayouts;
			this.pubColID = jsonBook.pubColID;
			this.defCVID = jsonBook.defCVID;
			this.defGPID = jsonBook.defGPID;

			if (jsonBook.schemas){
				for (var i = 0; i < jsonBook.schemas.length; i++){
					// create a new schema if one with same id does not already exists
					var schema = this.schemaMap[jsonBook.schemas[i].id]; 
					if (schema === undefined){
						schema = this._createSchema(jsonBook.schemas[i].type, jsonBook.schemas[i]);
						this.schemaMap[jsonBook.schemas[i].id] = schema;
					} else {
						Object.extend(schema, jsonBook.schemas[i]);
					}
				}
			}
			if (jsonBook.groups){
				if (!this.groupsMap || !this.groups || this.groups.length == 0){
					this.groupsMap = new Array();
					this.groups = jsonBook.groups;
					for (var i = 0; i < jsonBook.groups.length; i++){
						this.groupsMap[jsonBook.groups[i].id] = i;
					}
				} else {
					for (var i = 0; i < jsonBook.groups.length; i++){
						var group = this.groupsMap[jsonBook.groups[i].id]; 
						if (group === undefined){
							this.groupsMap[jsonBook.groups[i].id] = this.groups.length;
							this.groups.push( jsonBook.groups[i] );
						} else {
							this.groups[group] = jsonBook.groups[i];
						}
					}
				}
			}

			if (jsonBook.colDefs){
				for (var i = 0; i < jsonBook.colDefs.length; i++){
					// create a new colDef if one with same id does not already exists
					var colIndex = this.colDefMap[jsonBook.colDefs[i].id];
					if (colIndex == undefined){
					    if ( jsonBook.colDefs[i].deleted ) continue;
						this.colDefMap[jsonBook.colDefs[i].id] = this.colDefs.length;
						this.colDefs.push(this._createColDef( jsonBook.colDefs[i], this, this.schemaMap ));
					} else {
					    var colDef = this.colDefs[colIndex]; 
						colDef.comput_err = false;
						Object.extend(colDef, jsonBook.colDefs[i]);
						// clear all grades in column if computation error for column
						if (jsonBook.colDefs[i].comput_err){
							var grades = this._getGradesForItemId(jsonBook.colDefs[i].id, true);
							for (var g = 0; g < grades.length; g++){
								grades[g].initialize( grades[g].colDef, grades[g].metaData);
							}
						}
						if (colDef.deleted){
							this.colDefMap[colDef.id] = null;
						}
						if (colDef.sid){
							colDef.primarySchema = this.schemaMap[colDef.sid];
						}
						if (colDef.ssid && colDef.ssid.length > 0){
							colDef.secondarySchema = this.schemaMap[colDef.ssid];
						} else {
							colDef.secondarySchema = null;
						}
					}
				}
			}
			// need to add any new row data?
			while (this.rows.length > 0 && this.colDefs.length > this.rows[0].length){
				var colDefIndex = this.rows[0].length;
				for (var i = 0; i < this.rows.length; i++){
					var metaData = this.rows[i][0].metaData;
					var colDef = this.colDefs[colDefIndex];
					if ( colDef instanceof Gradebook.GradeColDef ) 
						this.rows[i].push(new Gradebook.Grade( colDef, metaData ));
					else
						this.rows[i].push(new Gradebook.StudentAttribute( colDef, metaData ));
				}
			}
			if (jsonBook.rows){
				// users changed, need to resync
				if (jsonBook.type == "delta_with_user"){
					// remove rows from model that are not in json data
					var tempArray = new Array();
					for (var i = 0; i < this.rows.length; i++){
						if (this._containsUser(jsonBook.rows, this.rows[i][0].getUserId())) {
							tempArray.push(this.rows[i]);
						}
					}
					this.rows = tempArray;
				}
				// add new json rows to model or update existing rows
				for (var i = 0; i < jsonBook.rows.length; i++){
					var row = this.getRowByUserId(jsonBook.rows[i][0].uid);
					if (row == null){ // new row
						this.rows.push(this._loadRowDataFromJSON(jsonBook.rows[i], this.colDefs, this.colDefMap));
					} else {
						this._updateRowDataFromJSON(row, jsonBook.rows[i], this.colDefs, this.colDefMap);
					}
				}
			}
			this._buildGradingPeriodMap();
			if (jsonBook.customViews){
				for (var i = 0; i < jsonBook.customViews.length; i++){
					// create a new custom view if one with same id does not already exists
					var idx = this.customViewMap[jsonBook.customViews[i].id]; 
					if (idx === undefined){
						this.customViewMap[jsonBook.customViews[i].id] = this.customViews.length;
						this.customViews.push(new Gradebook.CustomView( jsonBook.customViews[i], this ));
					} else {
						this.customViews[idx] = new Gradebook.CustomView( jsonBook.customViews[i], this );
					}
				}
			}
			// remove any custom views not in customViewIds
			if (this.customViews){
				var tempArray = new Array();
				this.customViewMap = new Array();
				for (var i = 0; i < this.customViews.length; i++){
					if ( jsonBook.customViewIds.indexOf( this.customViews[i].id ) != -1 )  {
						this.customViewMap[this.customViews[i].id] = tempArray.length;
						tempArray.push(this.customViews[i]);
					}
				}
				this.customViews = tempArray;
			}
			if (this.customViewIdParam != null && this.customViewIdParam.length > 0 ) {
				this._internalChangeCurrentView( 'cv_' + this.customViewIdParam );
			} else if (this.currentView) {
				this._internalChangeCurrentView( this.currentView );
			}
			this._setStudentInfoLayout();
			this._updateVisibleRows(jsonBook);
			this.sortColumns();
			this.reSort();
			this.checkedNoStudents(); // do this last, it will fireModelChanged
		} catch (e) {
			this.fireModelError(e);
		}
	},

    _buildCategoryNameMap: function( jsonBook ) {
		this.catNameMap = new Array();
		if ( jsonBook.categories ) {
			for (var i = 0; i < jsonBook.categories.length; i++){
				this.catNameMap[jsonBook.categories[i].id] = jsonBook.categories[i].name;
			}
		}
	},

	_updateVisibleRows: function(jsonBook) {
		var showAll = (!jsonBook.hiddenStudentIds || jsonBook.hiddenStudentIds.length == 0);
		this.visibleRows = new Array();
		var rows = this.rows;
		// loop through rows and set hidden flag for each row, add to visibleRows if not hidden
		for (var i = 0, len = rows.length; i < len; i++){
			var row = rows[i];
			var isHidden = !showAll && ( jsonBook.hiddenStudentIds.indexOf( row[0].getUserId() ) != -1 );
			row[0].setHidden( isHidden );
			if ( !isHidden ) {
				this.visibleRows.push( row );
			}
		}
		this._applyCustomView();
		
	},

    updateUserVisibility: function ( userId, visible ) {
    	this.gradebookService.updateUserVisibility( userId, visible );
    },
    
	_hasNewUsers: function(jsonBook) {
		if (!jsonBook || !jsonBook.rows) return false;
		for (var i = 0; i < jsonBook.rows.length; i++){
			if (this.getRowByUserId(jsonBook.rows[i][0].uid) == null) return true;
		}
		return false;
	},

	_containsUser: function(rows, userId) {
		for (var i = 0; i < rows.length; i++){
			if (rows[i][0].uid == userId) return true;
		}
		return false;
	},

	_createColDef: function(jsonColDef,model,schemaMap) {
		if (jsonColDef.type == "s"){
			return new Gradebook.StudentAttributeColDef( jsonColDef, model, schemaMap );
		} else {
			return new Gradebook.GradeColDef( jsonColDef, model, schemaMap );
		}
	},

	_createSchema: function(type,jsonSchema) {
		if (type == "S"){
			return new Gradebook.NumericSchema( jsonSchema, this );
		} else if (type == "X") {
			return new Gradebook.TextSchema( jsonSchema, this );
		} else if (type == "P") {
			return new Gradebook.PercentageSchema( jsonSchema, this );
		} else if (type == "C") {
			return new Gradebook.CompleteIncompleteSchema( jsonSchema, this );
		} else if (type == "T") {
			return new Gradebook.LetterSchema( jsonSchema, this );
		} else {
			GradebookUtil.debug('GridModel _createSchema invalid type: '+type);
			return null;
		}
		
	},

	_setStudentInfoLayout: function(){
		// set pos & gbvis for student attribute columns from studentInfoLayouts
		for (var i = 0; i < this.studentInfoLayouts.length; i++){
			var colIndex = this.colDefMap[this.studentInfoLayouts[i].id]; 
			if (colIndex === undefined){
				continue;
			}
			var colDef = this.colDefs[colIndex];
			colDef.gbvis = this.studentInfoLayouts[i].gbvis;
			colDef.pos = this.studentInfoLayouts[i].pos;
		}
	},

	_loadRowDataFromJSON: function(jsonRow, colDefs, colDefMap){

		// create a student attribute/grade for each column with a default blank value
		var tempRow = new Array();
		var userId = '';
		if (jsonRow[0].uid){
			userId = jsonRow[0].uid;
		}
		var metaData = new Gradebook.RowMetaData( userId );
		// create a gridcell of appropriate type for each column in the row
		for (var i = 0; i < colDefs.length; i++){
			if ( colDefs[i] instanceof Gradebook.GradeColDef ) 
				tempRow[i] = new Gradebook.Grade( colDefs[i], metaData );
			else
				tempRow[i] = new Gradebook.StudentAttribute( colDefs[i], metaData );
		}
		// populate cell data from json - may not include all cells (I.e. null grades)
		for (var i = 0; i < jsonRow.length; i++){
			//use json colDefID to get column index from map
			var colIndex = colDefMap[jsonRow[i].c];
			if (colIndex == undefined){
				GradebookUtil.error('GridModel _loadRowDataFromJSON jsonRow contains data for invalid column id: '+jsonRow[i].c);
				continue;
			}
			//overwrite default value with json value  
			tempRow[colIndex]._loadFromJSON(jsonRow[i]);
		}
		return tempRow;
    },
			
	_updateRowDataFromJSON: function(thisRow, jsonRow, colDefs, colDefMap){

		var metaData = thisRow[0].metaData;
		for (var i = 0; i < jsonRow.length; i++){
			var colIndex = colDefMap[jsonRow[i].c];
			var grade = thisRow[colIndex];
			if (grade === undefined){ // new grade?
				if ( colDefs[colIndex] instanceof Gradebook.GradeColDef ) 
					grade = new Gradebook.Grade( colDefs[colIndex], metaData );
				else
					grade = new Gradebook.StudentAttribute( colDefs[colIndex], metaData );
				thisRow.push(grade);
			}
			colDefs[colIndex].comput_err = false;
			grade._loadFromJSON(jsonRow[i]);
		}
    },
			
	// called by view to get a window of row data
	// returns iterators to get row data in correct order while skipping hidden columns
	getRowIterators: function(startRow, numRows, startCol) {
		var rows = this.visibleRows;
		if (!startRow) startRow = 0;
		if (!startCol) startCol = 0;
		if (!numRows) numRows = rows.length;
		var endRow = startRow + numRows

		if (startRow < 0 || startRow >= rows.length) {
			GradebookUtil.error('getRowIterators startRow out of range. Max is: '+rows.length-1+' startRow is: '+startRow);
			return null;
		}
		if (numRows < 0 || numRows > rows.length) {
			GradebookUtil.error('getRowIterators numRows out of range. Max is: '+rows.length+' numRows is: '+numRows);
			return null;
		}
		if (startCol < 0 || startCol >= this.colOrderMap.length) {
			GradebookUtil.error('getRowIterators startCol out of range. Max is: '+this.orderMap.length+' startCol is: '+startCol);
			return null;
		}
		if ( endRow > rows.length){
			endRow = rows.length
			GradebookUtil.error('Error: GridModel getRowIterators input args requesting too much data. startRow = '+startRow+' numRows = '+numRows+' rows.length = '+rows.length);
			return null;
		}

		var results = new Array()
		var index = 0;
		for ( var i=startRow ; i < endRow; i++ ) {
			results[index++] = new Gradebook.GridRowIterator(rows[i],this.colOrderMap,startCol);
		}
		return results;
	},
	
	// called by view to get the column definitions
	// returns iterator to get definitions in correct order while skipping hidden columns
	getColDefIterator: function(startCol) {
		if (!startCol) startCol = 0;
		if (startCol < 0 || startCol >= this.colOrderMap.length) {
			GradebookUtil.error('getColDefIterator startCol out of range. Max is: '+this.orderMap.length+' startCol is: '+startCol);
			return null;
		}
		return new Gradebook.GridRowIterator(this.colDefs,this.colOrderMap,startCol);
	},
	
	// called by view to determine how much vertical scroll is needed
	getNumRows: function() {
		if (this.visibleRows)
			return this.visibleRows.length;
		else 
			return 0;
	},

	// called by view to determine how much horizontal scroll is needed
	getNumColDefs: function() {
		return this.colOrderMap.length;
	},

	// called by view to determine how many columns to freeze
	getNumFrozenColumns: function() {
		return this.numFrozenColumns;
	},

	getSortDir: function(){
		return this.sortDir;
	}, 
	
	getSortIndex: function(){
		if (this.sortColumnId === undefined){
			return -1;
		}
		var colnum = this.colDefMap[this.sortColumnId];
		if (colnum === undefined){
			return -1;
		} else {
			var sortColumn = this.colOrderMap[colnum];
			if (sortColumn === undefined || this.colDefs[sortColumn] === undefined ||
				this.colDefs[sortColumn].deleted == "Y"){
				return -1;
			} else {
				return colnum;
			}
		}
	}, 
	
	reSort: function() {
		if (this.sortColumnId === undefined || this.sortDir === undefined) return;
		var colnum = this.getSortIndex();
		if (colnum == -1) return;
		this.sort(colnum, this.sortDir);
	},

	setDefaultView: function(view) {
		this.gradebookService.setDefaultView( view );
	},	
	
	getDefaultView: function() {
		// do not return a view that does not exist in model
		if (this.defCVID) {
		    if ( this.customViewMap[ this.defCVID ] ) return 'cv_' + this.defCVID;
		    return null;
		} else if (this.defGPID){
		    if ( this.gradingPeriodMap && !this.gradingPeriodMap[ this.defGPID ] ) return null;
			return this.defGPID;
		} else {
			return null;
		}
	},	
	
	// changes the current view to a grading period or custom view
	// returns error string or null if no error
	changeCurrentView: function(view) {
		// null out customViewIdParam so that it will not override the view set by the user next time the page is reloaded
		this.customViewIdParam = null;
		return this._internalChangeCurrentView(view);
	},
	
	_internalChangeCurrentView: function(view) {
		var origView = this.currentView;
		this.currentView = view;
		this.currentCustomView = null;
		this.currentGradingPeriodId = null;

		if (view.startsWith('cv_')){
			var idx = this.customViewMap[view.substring(3)]; 
			if (idx == undefined){
              	if ( this.defCVID ) {
              	    var defaultView = 'cv_' + this.defCVID;
              	    if ( defaultView != view ) {
              	    	this._internalChangeCurrentView( defaultView );
              	    } else {
					  this.currentView = (this.currentView != origView) ? origView : null;
					  return null; //this.getMessage('custViewDoesNotExistMsg');
					}
			  	} else if (this.defGPID) {
					this._internalChangeCurrentView( this.defGPID );
			  	} else {
					this.currentView = (this.currentView != origView) ? origView : null;
					return null; //this.getMessage('custViewDoesNotExistMsg');
		  		}
			} else {
				if (!this.customViews[idx].evaluate()){
					this.currentView = (this.currentView != origView) ? origView : null;
					return this.getMessage('changesEffectCustViewMsg');
				}
				this.currentCustomView = this.customViews[idx];
			}
		} else {
		    if ( this.gradingPeriodMap && !this.gradingPeriodMap[ view ] ) 
		    {
		       	if ( this.defCVID ) {
           	    	this._internalChangeCurrentView( 'cv_' + this.defCVID );
			  	} else if (this.defGPID && this.defGPID!=view) {
					this._internalChangeCurrentView( this.defGPID );
			  	} else {
					this.currentView = (this.currentView != origView) ? origView : null;
  		            this.currentGradingPeriodId = null;
		  		}
		      	return null;
		    }
			this.currentGradingPeriodId = view;
		}
		return null;
	},

	_applyCustomView: function() {
		if(this.currentCustomView == null || this.currentCustomView == undefined){
			return;
		}
		this.currentCustomView.evaluate( this );
		var userIds = this.currentCustomView.getUserIds();
		this.visibleRows = new Array();
		// loop through custom view users and add to visibleRows
		for (var i = 0, len = userIds.length; i < len; i++){
			var row = this.getRowByUserId(userIds[i]);
			if (row) this.visibleRows.push( row );
		}
	},
	
	_buildGradingPeriodMap: function() {
		this.gradingPeriodMap = new Array();
		if (this.gradingPeriods){
			for (var i = 0, len = this.gradingPeriods.length; i < len; i++){
				this.gradingPeriodMap[this.gradingPeriods[i].id] = this.gradingPeriods[i];		
			}
			this.gradingPeriods.sort(
				function(a,b){
					var aa = a.name.toLowerCase();
					var bb = b.name.toLowerCase();
					if (aa == bb) return 0;
					else if (aa < bb) return -1;
					else return 1;
				}
			);
		}
	},

	getCustomView: function(cvId) {
		var idx = this.customViewMap[cvId]; 
		if (idx == undefined){
			return null;
		} else {
			return this.customViews[idx];
		}
	},

	getCurrentCustomView: function(cvId) {
		return this.currentCustomView;
	},

	sortColumns: function(sortBy) {
		if (this.sortColAscending == undefined){
			this.sortColAscending = true;
		}
		
		if (sortBy){
			if (this.currentSortColumnBy == sortBy){
				this.sortColAscending = !this.sortColAscending;
			} else {
				this.sortColAscending = true;
				this.currentSortColumnBy = sortBy;
			}
		}
		else if (!this.currentSortColumnBy){
			this.currentSortColumnBy = 'pos';
		}
		var sortFunc = null;
		sortBy = this.currentSortColumnBy;
		if (sortBy == 'pos'){
			sortFunc = this._sortColByPosFunc.bind(this);
		} else if (sortBy == 'categories'){
			sortFunc = this._sortColByCategoriesFunc.bind(this);
		} else if (sortBy == 'dueDate') {
			sortFunc = this._sortColByDueDateFunc.bind(this);
		} else if (sortBy == 'creationdate') {
			sortFunc = this._sortColByCreationDateFunc.bind(this);
		} else if (sortBy == 'points') {
			sortFunc = this._sortColByPointsFunc.bind(this);
		} else if (sortBy == 'name') {
			sortFunc = this._sortColByNameFunc.bind(this);
		}
		
		var tempColDefs = new Array();
		
		if(this.currentCustomView){
			var colIds = this.currentCustomView.getDisplayItemIds();
			tempColDefs = this._getVisibleToAll( this.currentCustomView.includeHiddenItems, colIds );
			for (var i = 0, len = colIds.length; i < len; i++){
				var cd = this.colDefs[this.colDefMap[colIds[i]]];
				tempColDefs.push(cd);
			}
		} else {
			// filter out colDefs that are: deleted, hidden, not in all grading periods
			// or not in current grading period
			for (var i = 0, len = this.colDefs.length; i < len; i++){
				var cd = this.colDefs[i];
				if (cd.deleted || !cd.gbvis) continue;
				var cgp = this.currentGradingPeriodId;
				var ingp = (cgp == undefined || cgp == cd.gpid || cgp == 'all' || (cgp == 'none' && cd.gpid == ''));
				if (cd.visAll || !cd.isGrade() || ingp){
					tempColDefs.push(cd);
				}
			}
		}
		tempColDefs.sort(sortFunc);

		// compute colOrderMap based on the sorted columns
		this.colOrderMap = new Array();
		for (var i = 0, len = tempColDefs.length, idx = 0; i < len; i++){
			this.colOrderMap[idx++] = this.colDefMap[tempColDefs[i].id];
		}		
	},

	_getVisibleToAll: function( includeHidden, excludeIds ) {
		var tempColDefs = new Array();
		for (var i = 0, len = this.colDefs.length; i < len; i++){
			var cd = this.colDefs[i];
			if (excludeIds.indexOf( cd.id ) != -1) continue;
			var visAll = cd.visAll || !cd.isGrade();
			if (cd.deleted || !visAll || (!includeHidden && !cd.gbvis)) continue;
			tempColDefs.push(cd);
		}
		return tempColDefs;
	},

	// if both a & b are NOT visible to all, returns null
	// if both a & b are visible to all, sorts by position
	// if a is visible to all, returns -1 so visible to all columns come first
	// if b is visible to all, returns 1 so visible to all columns come first
	_sortVisibleToAll: function(a,b) {
		var aVisAll = a.visAll || !a.isGrade();
		var bVisAll = b.visAll || !b.isGrade();
		if (!aVisAll && !bVisAll) {
			return null;
		} else if (aVisAll && bVisAll) {
			return a.pos - b.pos;
		} else if (aVisAll) {
			return -1;
		} else if (bVisAll) {
			return 1;
		}
	},

	_sortColDir: function(result) {
		return (this.sortColAscending)?result:result*-1;
	},

	_sortColByPosFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var gpPosA = (a.gpid.blank())?-1:this.gradingPeriodMap[a.gpid].pos;		
		var gpPosB = (b.gpid.blank())?-1:this.gradingPeriodMap[b.gpid].pos;	
		var res;	
		if (gpPosA == gpPosB){
			res = a.pos - b.pos;
		} else if (gpPosA >= 0 && gpPosB >= 0){
			res = gpPosA - gpPosB;
		} else if (gpPosB == -1) {
			res = -1;
		} else {
			res = 1;
		}
		return this._sortColDir( res );
	},

	_sortColByPointsFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var aa = a.points;
		var bb = b.points;
		var res;	
		if (aa==bb) 
			res = a.cdate - b.cdate;
		else if (aa<bb) 
			res = -1;
		else
			res = 1;
		return this._sortColDir( res );
	},

	_sortColByNameFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var aa = a.name;
		var bb = b.name;
		var res;	
		if (aa==bb) 
			res = a.cdate - b.cdate;
		else if (aa<bb) 
			res = -1;
		else
			res = 1;
		return this._sortColDir( res );
	},

	_sortColByDueDateFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var aa = a.due;
		var bb = b.due;
		var res;	
		if (aa==bb) 
			res = a.cdate - b.cdate;
		else if (aa==0) 
			res = -1; // items with no due date, appear before items with due date
		else if (bb==0) 
			res = 1; // items with no due date, appear before items with due date
		else if (aa<bb) 
			res = -1;
		else 
			res = 1;
		return this._sortColDir( res );
	},

	_sortColByCreationDateFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var res = a.cdate - b.cdate;
		return this._sortColDir( res );
	},

	_sortColByCategoriesFunc: function(a,b) {
		var sf = this._sortVisibleToAll(a,b);
		if (sf != null) return sf;
		var aa = a.getCategory();
		var bb = b.getCategory();
		var res;
		if (aa==bb) 
			res = a.cdate - b.cdate;
		else if (aa<bb) 
			res = -1;
		else
			res = 1;
		return this._sortColDir( res );
	},

	sort: function(colnum, sortdir) {
		if (colnum < -1 || colnum >= this.colOrderMap.length) {
			GradebookUtil.error('sort colnum out of range. Max is: '+this.orderMap.length+' colnum is: '+colnum);
			return;
		}
		GradebookUtil.debug('GridModel sort called. colnum: '+colnum+' sortdir: '+sortdir);
		this.sortDir = sortdir;
		var sortFunc;
		if (colnum == -1){
			this.sortColumnId = null;
			if (sortdir=='ASC')
				sortFunc = this._sortCheckedASC.bind(this);
			else
				sortFunc = this._sortCheckedDESC.bind(this);
		} else {
			var sortColumn = this.colOrderMap[colnum];
			var secondarySortColumn = this.colDefMap['LN'];
			var colDef = this.colDefs[sortColumn];
			this.sortColumnId = colDef.id;
			if ( this.sortColumnId == 'LN' ){
			  secondarySortColumn = this.colDefMap['FN'];
			}
			sortFunc = colDef.getSortFunction(sortColumn, sortdir, secondarySortColumn);
		}
		this.visibleRows.sort(sortFunc);
	},

	_sortCheckedASC: function(a,b) {
		var aa = a[0].isRowChecked()?1:0;
		var bb = b[0].isRowChecked()?1:0;
		if (aa==bb) return 0;
		if (aa<bb) return -1;
		return 1;
	},

	_sortCheckedDESC: function(a,b) {
		var aa = a[0].isRowChecked()?1:0;
		var bb = b[0].isRowChecked()?1:0;
		if (aa==bb) return 0;
		if (bb<aa) return -1;
		return 1;
	},
   
	// called by cumultive item authoring
	// returns gradable items
	getColDefs: function (gradableOnly, includeHidden) {
   		var colDefs =  this.colDefs;
   		var retColDefs = new Array();
		for (var i = 0, len = colDefs.length; i < len; i++){
			var c = colDefs[i];
			if (!c.deleted && (!gradableOnly || c.isGrade()) && (includeHidden || !c.isHidden())){
				retColDefs.push( c );
			}
		}
		return retColDefs;
	},
   
	// called by grade detail page
	getCurrentColDefs: function (includeCalculated) {
   		var colDefs =  this.colDefs;
   		var retColDefs = new Array();
		for (var i = 0, len = this.colOrderMap.length; i < len; i++){
			var c = colDefs[this.colOrderMap[i]];
			if (c.isGrade() && (includeCalculated || !c.isCalculated()) ){
				retColDefs.push( c );
			}
		}
		return retColDefs;
	},

	// called by grade detail page
   getNextColDefId: function (colDefs, colDefId) {
		for (var i = 0; i < colDefs.length-1; i++){
			if (colDefs[i].getID() == colDefId){
			  return colDefs[i+1].getID();
			}
		}
		return null;
   },

	// called by grade detail page
   getPrevColDefId: function (colDefs, colDefId) {
		for (var i = 1; i < colDefs.length; i++){
			if (colDefs[i].getID() == colDefId){
			  return colDefs[i-1].getID();
			}
		}
		return null;
   },
   
	// called by grade detail page
   getStudents: function (includeHidden) {
   		var rows =  (includeHidden) ? this.rows : this.visibleRows;
		var students = new Array();
		var LAST_NAME_COL_IDX = 0;
		var FIRST_NAME_COL_IDX = 1;
		var USER_NAME_COL_IDX = 2;
		for (var i = 0; i < rows.length; i++){
			var s = {};
			var row = rows[i];
			s.last = row[LAST_NAME_COL_IDX].v;
			s.first = row[FIRST_NAME_COL_IDX].v;
			s.user = row[USER_NAME_COL_IDX].v;
			s.id = row[0].getUserId();
			s.hidden = row[0].isHidden();
			s.available = row[0].isAvailable();
			students.push( s );
		}
		return students;
   },
   
   // called by cumulative item page
   getGradingPeriods: function () {     		
		return this.gradingPeriods;
   },
   
   // called by cumulative item page
   getCategories: function () {    		
		return this.categories;
   },

	// called by grade detail page
   getNextUserId: function (userId) {
		for (var i = 0; i < this.visibleRows.length-1; i++){
			if (this.visibleRows[i][0].getUserId() == userId){
			  return this.visibleRows[i+1][0].getUserId();
			}
		}
		return null;
   },

	// called by grade detail page
   getPrevUserId: function (userId) {
		for (var i = 1; i < this.visibleRows.length; i++){
			if (this.visibleRows[i][0].getUserId() == userId){
			  return this.visibleRows[i-1][0].getUserId();
			}
		}
		return null;
   },

	// called by grade detail page; returns null if invalid colId
   getRawValue: function (colId, displayValue) {
		var colIndex = this.colDefMap[colId]; 
		if (colIndex === undefined){
			return null;
		}
		var colDef = this.colDefs[colIndex];
		return colDef.getRawValue(displayValue);
   },

	// called by grade detail page; returns null if invalid colId
   getDisplayValue: function (colId, rawValue) {
		var colIndex = this.colDefMap[colId]; 
		if (colIndex === undefined){
			return null;
		}
		var colDef = this.colDefs[colIndex];
		return colDef.getDisplayValue(rawValue);
   },

  // called by grade detail page; returns null if invalid colId 
  getDisplayType: function(colId) {
    var colIndex = this.colDefMap[colId]; 
    if (colIndex === undefined){
      return null;
    }
    var colDef = this.colDefs[colIndex];
    return colDef.getDisplayType();
  },

	// called by grade detail page; returns validate error or null if no error
   validate: function (colId, newValue) {
		var colIndex = this.colDefMap[colId]; 
		if (colIndex === undefined){
			return null;
		}
		var colDef = this.colDefs[colIndex];
		return colDef.validate(newValue);
   },

   getCheckedStudentIds: function () {
   		var rows =  this.visibleRows;
		var students = new Array();
		for (var i = 0, len = rows.length; i < len; i++){
			if (rows[i][0].isRowChecked()){ 
				students.push(rows[i][0].getUserId());
			}
		}
		return students;
   },

   checkedAllStudents: function () {
   		var rows =  this.visibleRows;
		for (var i = 0, len = rows.length; i < len; i++){
			rows[i][0].setRowChecked(true);
		}
		this.fireModelChanged();
		
   },
   
   checkedNoStudents: function () {
   		var rows =  this.visibleRows;
		for (var i = 0, len = rows.length; i < len; i++){
			rows[i][0].setRowChecked(false);
		}
		this.fireModelChanged();
   },

   invertCheckedStudents: function () {
   		var rows =  this.visibleRows;
		for (var i = 0, len = rows.length; i < len; i++){
			rows[i][0].invertChecked();
		}
		this.fireModelChanged();
   },

   checkedRangeOfStudents: function (uid1,uid2) {
   		var startId;
   		var rows =  this.visibleRows;
		for (var i = 0, len = rows.length; i < len; i++){
			var uid = rows[i][0].getUserId();
			if (!startId && (uid != uid1 && uid != uid2)) continue;
			else if (!startId && uid == uid1) startId = uid;
			else if (!startId && uid == uid2) startId = uid;
			else if (uid == uid1 || uid == uid2) break;
			else rows[i][0].setRowChecked(true);
		}
		this.fireModelChanged();
   },
   
   isAnyGradeModified: function (colId) {
		var colIndex = this.colDefMap[colId]; 
		if (colIndex === undefined){
			return false;
		}
   		var rows =  this.visibleRows;
		for (var i = 0; i < rows.length; i++){
			if (rows[i][colIndex].isModified()){ 
				return true;
			}
		}
		return false;
   },

   clearModifiedIndicator: function (colId, userId) {
		if (userId == -1){	// clear all modified indicators in column
			var colIndex = this.colDefMap[colId]; 
			if (colIndex === undefined){
				return;
			}
	   		var rows =  this.visibleRows;
			for (var i = 0; i < rows.length; i++){
				if (rows[i][colIndex].isModified()){ 
					rows[i][colIndex].clearModifiedIndicator();
				}
			}
			this.fireModelChanged();
		}
		this.gradebookService.clearModifiedIndicator(colId, userId);
   },

   clearAttempts: function (colId, clearOption, startDate, endDate) {
		this.gradebookService.clearAttempts(colId, clearOption, startDate, endDate);
   },
   
   updateGroups: function () {
   		var crsId = this.courseId;
		if (crsId.indexOf("_") >= 0) {
			crsId = crsId.split("_")[1];
		}
		var gradeCenterContentFrame = window.frames['gradecenterframe']; // Grade Center Frame in SSL mode
		if (!gradeCenterContentFrame) gradeCenterContentFrame = window.frames['content']; // regular course content frame
		gradeCenterContentFrame.GradebookDWRFacade.getGroups(crsId, Gradebook.GridModel.prototype.updateGroupsCallback );
   },
   
   updateGroupsCallback: function (retData) {
		var groupsMap = new Array();
		var groups = new Array();
   		var h = $H(retData);
		h.each(function(pair) {
			var g = {};
			g.id = pair.key;
			g.uids = pair.value;
			groupsMap[g.id] = groups.length;
			groups.push( g );
		});
		var model = Gradebook.getModel();   
		model.groupsMap = groupsMap;
		model.groups = groups;
	},
   
	// used by reporting
	getReportData: function (reportDef) {

		// get rows for students to include in report
		var userIds = null;
		if (reportDef.students == 'BYGROUPS'){
			if ( reportDef.groupIds == null ){
				GradebookUtil.error('GridModel error getReportData: no reportDef.groupIds');
				return null;
			}
			userIds = this._getUserIdsByGroupIds( reportDef.groupIds );
		} else if (reportDef.students == 'BYSTUDENT') {
			if ( reportDef.studentIds == null ){
				GradebookUtil.error('GridModel error getReportData: no reportDef.studentIds');
				return null;
			}
			userIds = reportDef.studentIds;
		}
		var rows = this._getRowsByUserIds( userIds ); 
		if ( !reportDef.includeHiddenStudents )
			rows = this._removeHiddenStudents(rows);
		// get columns to include in report
		var colDefs = this.getColDefs(true,true);
		if (reportDef.columns == 'BYITEM'){
			colDefs = this._getColDefsById( reportDef.itemIds );
		} else if (reportDef.columns == 'BYGP'){
			colDefs = this._getColDefsByGradingPeriodId( reportDef.gradingPeriodIds );
		} else if (reportDef.columns == 'BYCAT'){
			colDefs = this._getColDefsByCategoryId( reportDef.categoryIds );
		}
		if (!reportDef.includeHiddenColumns){
			colDefs = this._removeHiddenColumns( colDefs );
		}

		// create return data structure
		var reportData = {};
		reportData.columnInfoMap = new Array();
		reportData.studentGradeInfo = new Array();

		// add column data
		for (var i = 0, len = colDefs.length; i < len; i++){
			var cdef = colDefs[i];
			var cdata = {};
			reportData.columnInfoMap[cdef.id] = cdata;
			cdata.name = cdef.getName();
			if (reportDef.columnInfoDescription){
				cdata.description = 'tbd';		// server will provide desc map
			}
			if (reportDef.columnInfoDueDate){
				cdata.dueDate = cdef.getDueDate();
			}
			if (reportDef.columnInfoStatsMedian || reportDef.columnInfoStatsAverage){
				var stats = cdef.getStats( true ); // include unavailable students
				cdata.statsMedian = stats.median;
				cdata.statsAverage = stats.avg;
			}
		}
		
		// add student data
		for (var i = 0, len0 = rows.length; i < len0; i++){
			var row = rows[i];
			var rd = {};
			reportData.studentGradeInfo.push(rd);
	
			if (reportDef.firstName){
				rd.firstName = this._getStudentAttribute( row, 'FN' );
			}
			if (reportDef.lastName){
				rd.lastName = this._getStudentAttribute( row, 'LN' );
			}
			if ( reportDef.studentId ){
				rd.studentId = this._getStudentAttribute( row, 'SI' );
			}
			if ( reportDef.userName ){
				rd.userName = this._getStudentAttribute( row, 'UN' );
			}
			if ( reportDef.lastAccessed ){
				rd.lastAccessed = this._getStudentAttribute( row, 'LA' );
				if (rd.lastAccessed && rd.lastAccessed > 0){ 
					var date = new Date();
					date.setTime(rd.studentId);
					rd.lastAccessed = formatDate(date,'MMM d, y');
				}
			}
			rd.grades = new Array();
			for (var c = 0, len1 = colDefs.length; c < len1; c++){
				var g = {};
				g.cid = colDefs[c].id;
				var gridCell = this._getGrade( row, colDefs[c]);
				if (gridCell.attemptInProgress() && !gridCell.isOverride()) 
					g.grade = this.getMessage('inProgressMsg');
				else if (gridCell.needsGrading() && !gridCell.isOverride()) 
					g.grade = this.getMessage('needsGradingMsg');
				else 
					g.grade = gridCell.getCellValue();
				rd.grades.push( g );
			}
		}
		return reportData;
	},

	_getGrade: function( row, colDef ) {
			var colIndex = this.colDefMap[colDef.id];
			if (colIndex == undefined){
				GradebookUtil.error('GridModel _getGrade invalid column id: '+colDef.id);
				return null;
			}
			return row[colIndex];
	},

	_getStudentAttribute: function( row, colDefId ) {
			var colIndex = this.colDefMap[colDefId];
			if (colIndex == undefined){
				GradebookUtil.error('GridModel _getStudentAttribute invalid column id: '+colDefId);
				return null;
			}
			 return row[colIndex].getValue();
	},
	_removeHiddenStudents: function( students ) {
		var retStudents = new Array();
		for (var i = 0, len = students.length; i < len; i++){
			if (!students[i][0].isHidden()){	
				retStudents.push( students[i] );
			}
		}
		return retStudents;
	},

	_removeHiddenColumns: function( colDefs ) {
		var retColDefs = new Array();
		for (var i = 0, len = colDefs.length; i < len; i++){
			if (!colDefs[i].isHidden()){	
				retColDefs.push( colDefs[i] );
			}
		}
		return retColDefs;
	},

	_getColDefsById: function( itemIds ) {
		var colDefs = new Array();
		for (var i = 0, len = this.colDefs.length; i < len; i++){
			if (itemIds.indexOf( this.colDefs[i].id ) != -1){	
				colDefs.push( this.colDefs[i] );
			}
		}
		return colDefs;
	},

	_getColDefsByCategoryId: function( categoryIds ) {
		var colDefs = new Array();
		for (var i = 0, len = this.colDefs.length; i < len; i++){
			if (categoryIds.indexOf( this.colDefs[i].catid ) != -1){	
				colDefs.push( this.colDefs[i] );
			}
		}
		return colDefs;
	},

	_getColDefsByGradingPeriodId: function( gradingPeriodIds ) {
		var colDefs = new Array();
		for (var i = 0, len = this.colDefs.length; i < len; i++){
			if (gradingPeriodIds.indexOf( this.colDefs[i].gpid ) != -1){	
				colDefs.push( this.colDefs[i] );
			}
		}
		return colDefs;
	},

	_getRowsByUserIds: function( userIds ) {
		var rows = this.rows;
		if (userIds == null){
			return rows;
		}
		var retRows = new Array();
		for (var i = 0, len = rows.length; i < len; i++){
			if (userIds.indexOf(rows[i][0].getUserId()) != -1){
				retRows.push(rows[i]);
			}
		}
		return retRows;
	},

	_getUserIdsByGroupIds: function( groupIds ) {
		if ( !this.groupsMap || !this.groups ){
			GradebookUtil.error('GridModel error getUserIdsByGroupIds: no groups');
			return null;
		}
		var userIds = new Array();
		for (var i = 0; i < groupIds.length; i++){
			var index = this.groupsMap[groupIds[i]];
			if (index == undefined){
				GradebookUtil.error('GridModel error getUserIdsByGroupIds: no group for id: '+groupIds[i]);
				continue;
			}
			var group = this.groups[index];
			for (var g = 0; g < group.uids.length; g++){
				if (userIds.indexOf(group.uids[g]) == -1){
					userIds.push(group.uids[g]);
				}
			}
		}
		return userIds;
	},

	// called by student stats page
	getStudentStats: function( userId, currentViewOnly ) {
		var studentStats = {};
		studentStats.catStats = new Array();
		var catMap = new Array();

		
		// get columns, either all or current view
		var colDefs = new Array();
		var len = currentViewOnly ? this.colOrderMap.length : this.colDefs.length;
		for (var i = 0; i < len; i++){
			var idx = currentViewOnly ? this.colOrderMap[i] : i;
			var c = this.colDefs[idx];
			if (!c.deleted && c.isGrade() && !c.isCalculated()) {
				colDefs.push( c );
			}
		}

		var row = this.getRowByUserId(userId);
		
		for (var i = 0; i < colDefs.length; i++){
			var colDef = colDefs[i];
			var catId = colDef.getCategoryID();
			var catStat = catMap[catId];
			if (catStat == null){
				catStat = {};
				catStat.name = colDef.getCategory();
				catStat.qtyGraded = 0;
				catStat.qtyInProgress = 0;
				catStat.qtyNeedsGrading = 0;
				catStat.qtyExempt = 0;
				catStat.sum = 0;
				catStat.avg = 0;
				catMap[catId] = catStat;
				studentStats.catStats.push( catStat );
			}
			var grade = this._getGrade( row, colDef);
			var val = grade.getSortValue();
			var isNull = (val == '-');
			var isIP = grade.attemptInProgress();
			var isNG = grade.needsGrading();
			var isExempt = grade.isExempt();
			var isVal = (!isNull && !isIP && !isNG && !isExempt);
			if (isIP) 
				catStat.qtyInProgress++;
			else if (isNG) 
				catStat.qtyNeedsGrading++;
			else if (isExempt) 
				catStat.qtyExempt++;
			
			if (isVal){
				catStat.qtyGraded++;
				if (colDef.isCalculated()){
					val = parseFloat(val)/parseFloat(grade.getPointsPossible()) * 100.0;	
				}
				catStat.sum += parseFloat( val );
			}
		}
		studentStats.numItemsCompleted = 0;
		var totNumExempt = 0;
		for (var i = 0; i < studentStats.catStats.length; i++){
			var catStat = studentStats.catStats[i];
			if (catStat.sum > 0){
				catStat.avg = catStat.sum/parseFloat( catStat.qtyGraded );
				catStat.avg = NumberFormatter.getDisplayFloat( catStat.avg.toFixed(2) );
			}
			totNumExempt += catStat.qtyExempt;
			studentStats.numItemsCompleted += (catStat.qtyNeedsGrading + catStat.qtyGraded);
		}
		studentStats.numItems = colDefs.length - totNumExempt;
		return studentStats;
	},

	getAccessibleMode: function() {
		return this.accessibleMode;
	},
	
	setAccessibleMode: function( accessibleMode ) {
		this.accessibleMode = accessibleMode;
	},
	
	setLoggerDebugLevel: function(logger) {
		this.logger.setLevel(top.content.log4javascript.Level.DEBUG);
	},

	setLogger: function(logger) {
		this.logger = logger;
	},

	getLogger: function() {
		return this.logger;
	},

   setMessages: function (messages) {
      this.messages = messages;
   },

   getMessage: function (key) {
      if (this.messages){
      	return this.messages[key];
      } else {
      	return key;
      }
   }


};

Gradebook.RowMetaData = Class.create();
Gradebook.RowMetaData.prototype = {
	initialize: function(userId) {
		this.userId = userId;
		this.isChecked = false;
		this.isHidden = false;
		this.comput_err = false;
	}
};


//////////////////////////// Column Defs //////////////////////////////////////

Gradebook.ColDef = Class.create();
Gradebook.ColDef.prototype = {
	initialize: function(jsonObj, model, schemaMap) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
		if (this.sid){
			this.primarySchema = schemaMap[this.sid];
		}
		if (this.ssid){
			this.secondarySchema = schemaMap[this.ssid];
		}
	},

	getSortFunction: function(sortColumn, sortdir, secondarySortColumn) {
		this.sortColumn = sortColumn;
		this.secondarySortColumn = secondarySortColumn;
		if (sortdir=='ASC')
			return this._sortASC.bind(this);
		else
			return this._sortDESC.bind(this);
	},

	validate: function(newValue, matchPartial) {
		if (!this.primarySchema){
			return null;
		} else {
			return this.primarySchema.validate(newValue, matchPartial);
		}
	},

	_sortASC: function(a,b) {
		var aa = a[this.sortColumn].getValue();
		var bb = b[this.sortColumn].getValue();
        if( !aa && !bb ) return this._secondarySortASC(a,b);
        if( !aa ) return -1;
        if( !bb ) return 1;
        aa = aa.toUpperCase();
        bb = bb.toUpperCase();
		if (aa==bb)return this._secondarySortASC(a,b);
		if (aa<bb) return -1;
		return 1;
	},

	_secondarySortASC: function(a,b) {
		var aa = a[this.secondarySortColumn].getValue();
		var bb = b[this.secondarySortColumn].getValue();
        if( !aa || !bb ) return 0;
        aa = aa.toUpperCase();
        bb = bb.toUpperCase();
	    if (aa==bb) return 0;
		if (aa<bb) return -1;
		return 1;
	},

	_sortDESC: function(a,b) {
		var aa = a[this.sortColumn].getValue();
		var bb = b[this.sortColumn].getValue();
        if( !aa && !bb ) return this._secondarySortDESC(a,b);
        if( !bb ) return -1;
        if( !aa ) return 1;
        aa = aa.toUpperCase();
        bb = bb.toUpperCase();
		if (aa==bb)return this._secondarySortDESC(a,b);
		if (bb<aa) return -1;
		return 1;
	},

	_secondarySortDESC: function(a,b) {
		var aa = a[this.secondarySortColumn].getValue();
		var bb = b[this.secondarySortColumn].getValue();
        if( !aa || !bb ) return 0;
        aa = aa.toUpperCase();
        bb = bb.toUpperCase();
	    if (aa==bb) return 0;
		if (bb<aa) return -1;
		return 1;
	},

	getEditValue: function( gridCell ) {
		if (!this.primarySchema){
			return gridCell.getValue();
		}
		return this.primarySchema.getEditValue( gridCell );
	},

	// called by GridCell.getCellValue to get value for rendering in spreadsheet
	// uses primary (and optional secondary) schema to convert value to proper display format
	getCellValue: function( gridCell ){
		if (!this.primarySchema){
			return gridCell.getValue();
		}
		var cellVal = this.primarySchema.getCellValue( gridCell );
		if (this.secondarySchema){
			var cellVal2 = this.secondarySchema.getCellValue( gridCell );
			cellVal += ' <span>('+cellVal2+')</span>';
		}
          
		return new String(cellVal);
	},

	// called by GridCell.getAltValue to get alt (mouse over) value for rendering in spreadsheet
	// same as getCellValue unless there is a secondary schema
	getAltValue: function( gridCell ){
		if (gridCell.isExempt()) {
			return this.model.getMessage('cmExemptGrade');
		}
		
		if (!this.secondarySchema){
			return this.getCellValue( gridCell );
		}
		var cellVal = this.primarySchema.getCellValue( gridCell );
		if (this.secondarySchema){
			var cellVal2 = this.secondarySchema.getCellValue( gridCell );
			cellVal += ' ('+cellVal2+')';
		}
		return new String(cellVal);
	},

	getSortValue: function( gridCell ){
		return gridCell.getValue();
	},

	getName: function() {
		return this.name;
	},

	getID: function() {
		return this.id;
	},

	getPoints: function() {
		if ( this.isCalculated() ) 
			return GradebookUtil.getMessage( 'variesPerStudentMsg' );
		else
			return this.points;
	},

	getAliasID: function() {
		return this.id;
	},

	getCategoryID: function() {
		return this.catid;
	},

	getCategory: function() {
	    if (! this.catid ) return "";
	    if (! this.model.catNameMap ) return "";
	    var name = this.model.catNameMap[ Number(this.catid) ];
	    if ( name ) return name;
		return "";
	},

	getCategoryAliasID: function() {
		return this.catid;
	},

	isHidden: function() {
		return !this.gbvis;
	},

	isScorable: function() {
		return this.scrble;
	},

	isPublic: function() {
		return (this.id == this.model.pubColID);
	},

	isVisibleToStudents: function() {
		return this.vis;
	},

	onHideColumn: function() {
		this.gbvis = false;
		this.model.hideColumn(this.id);
	},

	getDisplayType: function( ) {
		return this.primarySchema.type;
	},

	hasError: function( ) {
		return this.comput_err;
	},
	
	// called by model.getDisplayValue when external pages need to convert a rawValue
	// This function passes this.points to schema.getDisplayValue. 
	// This method should not be called for this colDef if this colDef is a calculated 
	// column, because we do not have access to the gridCell to get its max points.
	// todo: determine how to handle error condition if this column is a calulated col
	getDisplayValue: function( rawValue ) {
		if (this.primarySchema){
			return this.primarySchema.getDisplayValue( rawValue, this.points );
		} else {
			return rawValue;
		}
	}

};

Gradebook.GradeColDef = Class.create();
Object.extend(Gradebook.GradeColDef.prototype, Gradebook.ColDef.prototype);
Object.extend (Gradebook.GradeColDef.prototype, {     
	initialize: function(jsonObj, model, schemaMap) {
		Gradebook.ColDef.prototype.initialize.call(this,jsonObj, model, schemaMap);
	},

	getRawValue: function( newValue ){
		var score = newValue;
		// compute score based on primary schema
		if (this.primarySchema){
			var rawValue = this.primarySchema.getRawValue(newValue,this);
			score = parseFloat( rawValue );
			if (!GradebookUtil.isValidFloat( rawValue )){
        		if (typeof(rawValue) == "string")
        			return rawValue;
				score = 0;
			}
		}
		return score;
	},

	getSortValue: function( gridCell ){
		if (this.primarySchema){
			return this.primarySchema.getSortValue( gridCell );
		} else {
			return gridCell.getValue();
		}
	},

	updateGrade: function( newValue, userId ){
		var score = this.getRawValue(newValue);
		var textValue = newValue;
		this.model.updateGrade(score, textValue, userId, this.id);
	},

	_sortASC: function(a,b) {
		var gradeA = a[this.sortColumn];
		var gradeB = b[this.sortColumn];
		var aa = gradeA.getSortValue();
		var bb = gradeB.getSortValue();
		if (gradeA.colDef.primarySchema instanceof Gradebook.TextSchema){
			if (aa==bb) return this._secondarySortASC(a,b);
			if (aa<bb) return -1;
			return 1;
		}
		var aaa = parseFloat(aa);
		var bbb = parseFloat(bb);
		var aNull = (aa == '-');
		var bNull = (bb == '-');
		var ax = gradeA.isExempt();
		var bx = gradeB.isExempt();
		var aIP = gradeA.attemptInProgress();
		var bIP = gradeB.attemptInProgress();
		var aNG = gradeA.needsGrading();
		var bNG = gradeB.needsGrading();
		var aNoScore = (aNull || ax || aIP || aNG || isNaN(aaa));
		var bNoScore = (bNull || bx || bIP || bNG || isNaN(bbb));
		var aVal = (ax)?1:(aIP)?2:(aNG)?3:(aNull)?0:aa;
		var bVal = (bx)?1:(bIP)?2:(bNG)?3:(bNull)?0:bb;
		if (aNoScore || bNoScore){
			if (aNoScore && bNoScore){
			  if (aVal == bVal) return this._secondarySortASC(a,b);
			  else return aVal-bVal;
			}
			if (aNoScore) return -1;
			else return 1;
		} else {
			if (aaa == bbb) return this._secondarySortASC(a,b);
			else return aaa-bbb;
		}
	},

	_sortDESC: function(a,b) {
		var gradeA = a[this.sortColumn];
		var gradeB = b[this.sortColumn];
		var aa = gradeA.getSortValue();
		var bb = gradeB.getSortValue();
		if (gradeA.colDef.primarySchema instanceof Gradebook.TextSchema){
			if (aa==bb) return this._secondarySortDESC(a,b);
			if (bb<aa) return -1;
			return 1;
		}
		var aaa = parseFloat(aa);
		var bbb = parseFloat(bb);
		var aNull = (aa == '-');
		var bNull = (bb == '-');
		var ax = gradeA.isExempt();
		var bx = gradeB.isExempt();
		var aIP = gradeA.attemptInProgress();
		var bIP = gradeB.attemptInProgress();
		var aNG = gradeA.needsGrading();
		var bNG = gradeB.needsGrading();
		var aNoScore = (aNull || ax || aIP || aNG || isNaN(aaa));
		var bNoScore = (bNull || bx || bIP || bNG || isNaN(bbb));
		var aVal = (ax)?1:(aIP)?2:(aNG)?3:(aNull)?0:aa;
		var bVal = (bx)?1:(bIP)?2:(bNG)?3:(bNull)?0:bb;
		if (aNoScore || bNoScore){
			if (aNoScore && bNoScore){
			  if (aVal == bVal) return this._secondarySortDESC(a,b);
			  else return bVal-aVal;
			}
			if (bNoScore) return -1;
			else return 1;
		} else {
			if (aaa == bbb) return this._secondarySortDESC(a,b);
			else return bbb-aaa;
		}
	},

	isGrade: function() {
		return true;
	},
	
	isCalculated: function() {
		return this.type != "N";
	},
	
	isTotal: function() {
		return this.type == "T";
	},
	
	isWeighted: function() {
		return this.type == "W";
	},
	
	isManual: function() {
		return this.manual;
	},
	
	isTextSchema: function(schemaId) {
		var schema = this.model.schemaMap[schemaId];
		if ((schema != undefined) && (schema.type == "X")){
			return true;
		}
		return false;				
	},
	
	isAssessment: function() {
		return (this.src && this.src == 'assmt');
	},

	isAssignment: function() {
		return (this.src && this.src == 'agn');
	},

	isAllowMulti: function() {
		return (this.am && this.am == "y");
	},

	showGradeDetails: function(userId){
		this.model.showGradeDetails( userId, this.id );
	},

	onAddComment: function(userId){
		this.model.onAddComment( userId, this.id );
	},
	
	exemptGrade: function(userId){
		this.model.exemptGrade( userId, this.id );
	},
	
  clearExemption: function(userId){
		this.model.clearExemption( userId, this.id );
	},

	setComments: function(userId, studentComments, instructorComments){
		this.model.setComments( userId, this.id, studentComments, instructorComments );
	},
	
	onModifyColumn: function() {
		this.model.modifyColumn(this.id,this.type);
	},
	
	

	onDeleteColumn: function() {
		if (confirm(this.model.getMessage('confirmDeleteItemMsg'))){
			this.model.deleteColumn(this.id);
		}
	},

	onViewInfo: function(evt) {
		this.cellController.viewColumnInfo(evt,this);
	},

	onClearModified: function(){ // clear all modified indicators in column
		this.clearModifiedIndicator(-1);
	},

   onItemStats: function () {
		this.model.viewItemStats(this.id);
   },

   clearModifiedIndicator: function (userId) {
		this.model.clearModifiedIndicator(this.id, userId);
   },
	
   clearAttemptsByDate: function (startDate, endDate) {
		this.model.clearAttempts(this.id, 'BYDATE', startDate, endDate);
   },

   onViewAssessmentStats: function () {
		this.model.gradebookService.viewAssessmentStats(this.id);
   },

   onMakeExternalGrade: function () {
		this.model.gradebookService.makeExternalGrade(this.id);
   },
   
   onDownloadAssessmentResults: function () {
		this.model.gradebookService.downloadAssessmentResults(this.id);
   },

   onAssignmentFileCleanup: function () {
		this.model.gradebookService.assignmentFileCleanup(this.id);
   },

   onAssignmentDownload: function () {
		this.model.gradebookService.assignmentDownload(this.id);
   },

   onClearAttempts: function (evt) {
		var data = $A(arguments);
		if (data[1] == 'BYDATE'){
			this.cellController.showDatePicker(evt,this);
		} else {
			this.model.clearAttempts(this.id, data[1]);
		}
   },
	
	getContextMenuInfo: function(cellController) {
		this.cellController = cellController;
		var isAssessment
		var menu = {
			id: "gradeHeaderCM",
			items: [
				{id: "gh_viewColumnInfo", visible:true,
					onclick: this.onViewInfo.bindAsEventListener(this)},
				{id: "gh_modifyColumn", visible:true,
					onclick: this.onModifyColumn.bindAsEventListener(this)},
				{id: "gh_columnStats", visible:!this.isTextSchema(this.sid),
					onclick: this.onItemStats.bindAsEventListener(this)},
				{id: "gh_hideColumn", visible:true,
					onclick: this.onHideColumn.bindAsEventListener(this),
					receipt: 'hideColumnInlineMsg' },
				{id: "gh_assessStats", visible:this.isAssessment(),
					onclick: this.onViewAssessmentStats.bindAsEventListener(this)},
				{id: "gh_makeExternalGrade", visible:!this.isPublic(),
					onclick: this.onMakeExternalGrade.bindAsEventListener(this)},
				{id: "gh_assessDownload", visible:this.isAssessment(),
					onclick: this.onDownloadAssessmentResults.bindAsEventListener(this)},
				{id: "gh_assignFileCleanup", visible:this.isAssignment(),
					onclick: this.onAssignmentFileCleanup.bindAsEventListener(this)},
				{id: "gh_assignDownload", visible:this.isAssignment(),
					onclick: this.onAssignmentDownload.bindAsEventListener(this)},
				{id: "gh_clearAllAttempts", visible: this.isAllowMulti() },
					{id: "gh_lastAttempt", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'LASTATTEMPT')},
					{id: "gh_firstAttempt", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'FIRSTATTEMPT')},
					{id: "gh_highestAttempt", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'HIGHESTATTEMPT')},
					{id: "gh_lowestAttempt", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'LOWEST')},
					{id: "gh_allAttempts", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'ALLATTEMPTS')},
					{id: "gh_clearByDate", visible:true,
						onclick: this.onClearAttempts.bindAsEventListener(this,'BYDATE')},
				{id: "gh_clearModified", visible:(this.model.isAnyGradeModified(this.id)),
					onclick: this.onClearModified.bindAsEventListener(this)},
				{id: "gh_deleteColumn", visible:( ( this.isManual() || this.isCalculated() ) && !this.isPublic()), 
					onclick: this.onDeleteColumn.bindAsEventListener(this)}
				]};
		return menu;			
	},
	
	
	getDueDate: function() {
		var dueDate = GradebookUtil.getMessage('noneMsg');
		if (this.due && this.due > 0){ 
			var date = new Date();
			date.setTime(this.due);
			dueDate = formatDate(date,'MMM d, y');
		}
		return dueDate;
	},
	
	// called by item stats page
	getStats: function ( includeUnavailableStudents ) {

		var grades = this.model._getGradesForItemId(this.id, includeUnavailableStudents);
		if (this.primarySchema instanceof Gradebook.TextSchema){
			grades = new Array();
		}
		
		var values = new Array();
		var sum = 0;
		var stats = {};
		stats.count = 0;
		stats.minVal = null;
		stats.maxVal = null;
		stats.qtyNull = 0;
		stats.qtyInProgress = 0;
		stats.qtyNeedsGrading = 0;
		stats.qtyExempt = 0;
		
		for (var i = 0; i < grades.length; i++){
			var grade = grades[i];
			var val = grade.getSortValue();
			var isNull = (val == '-');
			var isIP = grade.attemptInProgress();
			var isNG = grade.needsGrading();
			var isExempt = grade.isExempt();
			var isVal = (!isNull && !isIP && !isNG && !isExempt);
			if (isIP) 
				stats.qtyInProgress++;
			else if (isNG) 
				stats.qtyNeedsGrading++;
			else if (isExempt) 
				stats.qtyExempt++;
			else if (isNull) 
				stats.qtyNull++;
			
			if (isVal){
				if (this.isCalculated()){
					val = (parseFloat(val)/parseFloat(grade.getPointsPossible()) * 100.0);	
				}
				values.push( val );
				sum += parseFloat( val );
				stats.minVal = (stats.minVal == null) ? val : Math.min( val, stats.minVal);
				stats.maxVal = (stats.maxVal == null) ? val : Math.max( val, stats.maxVal);
			}
		}
		stats.count = values.length;
		
		if (values.length == 0){
			stats.avg = '';
			stats.range = '';
			stats.minVal = '';
			stats.maxVal = '';
			stats.median = '';
			stats.variance = '';
			stats.stdDev = '';
		} else {

			stats.avg = sum/values.length;
			stats.range = stats.maxVal - stats.minVal;
			
			values.sort( Gradebook.numberComparator );
			if (values.length == 1){
				stats.median = values[0];
			} else if (values.length % 2){
				// number of values is odd, the median is the middle value
				stats.median = values[parseInt(values.length/2)];
			} else {
				// number of values is even, the median is the average of the two middle values
				stats.median = (values[values.length/2-1] + values[values.length/2])/2;
			}
			stats.variance = this._computeVariance( values, stats.avg );
			stats.stdDev = Math.sqrt( stats.variance );

			stats.maxVal = this._formatFloat( stats.maxVal );
			stats.minVal = this._formatFloat( stats.minVal );
			stats.avg = this._formatFloat( stats.avg );
			stats.range = this._formatFloat( stats.range );
			stats.median = this._formatFloat( stats.median );
			stats.variance = this._formatFloat( stats.variance );
			stats.stdDev = this._formatFloat( stats.stdDev );
		}
		stats.gradeDistribution = this.primarySchema.getGradeDistribution( values, this.points, stats );
		return stats;
	},

	_formatFloat: function( f ) {
	    try {
			if ( f != null ) 
				return NumberFormatter.getDisplayFloat( f.toFixed(2) );
		} catch ( e ) {
			//ignore and return the current value 
		}
		return f;
		
	},

	_computeVariance: function( values, average ) {
		var sumXMeanSquare = 0;
		for (var i = 0; i < values.length; i++){
	        var xMean = values[i] - average;
	        sumXMeanSquare += (xMean * xMean);
		}
		return sumXMeanSquare / values.length;
	},
	
	getInfo: function() {
		var publicLabel;
		if (this.isPublic())
			publicLabel = GradebookUtil.getMessage('isMsg');
		else
			publicLabel = GradebookUtil.getMessage('isNotMsg');
		var includedInCalculationsLabel;
		if (this.isScorable())
			includedInCalculationsLabel = GradebookUtil.getMessage('yesMsg');
		else
			includedInCalculationsLabel = GradebookUtil.getMessage('noMsg');
		var points;
		if ( this.isCalculated() )
			points = GradebookUtil.getMessage( 'variesPerStudentMsg' );
		else
			points = NumberFormatter.getDisplayFloat( this.points );
		var info = [
			{id: "itemInfoName", value: this.name},
			{id: "itemInfoCategory", value: this.getCategory()},
			{id: "itemInfoSchema", value: this.primarySchema.name},
			{id: "itemInfoPoints", value: (points==0?"-":points)},
			{id: "itemInfoPublic", value: publicLabel},
			{id: "itemInfoIncludedInCalculations", value: includedInCalculationsLabel},
			{id: "itemInfoDueDate", value: this.getDueDate()}
			];
		return info;
	}
});

Gradebook.StudentAttributeColDef = Class.create();
Object.extend(Gradebook.StudentAttributeColDef.prototype, Gradebook.ColDef.prototype);
Object.extend (Gradebook.StudentAttributeColDef.prototype, {     
	initialize: function(jsonObj, model, schemaMap) {
		Gradebook.ColDef.prototype.initialize.call(this,jsonObj, model, schemaMap);
		this.vis = true;
	},

	isGrade: function() {
		return false;
	},

	isCalculated: function() {
		return false;
	},
	
	isTotal: function() {
		return false;
	},
	
	isWeighted: function() {
		return false;
	},
	
	// called by GridCell.getCellValue to get value for rendering in spreadsheet
	// format date for last access column, all other columns just return gridcell value
	getCellValue: function( gridCell ){
		var cellVal = gridCell.getValue();
		if (this.id == 'LA'){ // last accessed column
			var dueDate = '';
			if (cellVal && cellVal > 0){ 
				var date = new Date();
				date.setTime(cellVal);
				cellVal = formatDate(date,'MMM d, y');
			}
		}
		return cellVal;
	},

	getRawValue: function( newValue ){
		return newValue;
	},

    updateUserVisibility: function ( userId, visible ) {
        this.model.updateUserVisibility( userId, visible );
    },
    
	getContextMenuInfo: function(cellController) {
		this.cellController = cellController;
		var canHide = (this.model.colOrderMap[0] != this.model.colDefMap[this.id]);
		if (!canHide) return null;
		var menu = {
			id: "studentInfoHeaderCM",
			items: [
				{id: "sih_hideColumn", visible:canHide,
					onclick: this.onHideColumn.bindAsEventListener(this), receipt: 'hideColumnInlineMsg' }
				]};
		return menu;			
	}
});

//////////////////////////// Grid Cells //////////////////////////////////////

Gradebook.GridCell = Class.create();

Gradebook.GridCell.prototype = {
	
	initialize: function(colDef, metaData) {
		this.colDef = colDef;
		this.metaData = metaData;
		this.v = "-";
		this.canBeEdited = true;
		this.isBeingEdited = false;
		this.isUncommitted = false;
		if (this.colDef.id == 'UN'){
			this.metaData.userNameGridCell = this;
		}
	},

	_loadFromJSON: function(jsonObj) {
		this.gc = null; // grade change flag
		this.ip = null; // in progress flag
		this.ng = null; // needs grading flag
		this.or = null; // override flag
		this.x  = null; // exempt flag cleared
		if ( !(jsonObj.avail === undefined) ){
			this.metaData.avail = jsonObj.avail;
		}
		Object.extend(this, jsonObj); // assign json properties to this object
	},
	
	getUserId: function() {
		return this.metaData.userId;
	},

	getUserName: function() {
		return this.metaData.userNameGridCell.v;
	},
	

	isHidden: function() {
		return this.metaData.isHidden;
	},
	
	setHidden: function( h ) {
		this.metaData.isHidden = h;
	},
	
	isRowChecked: function() {
		return this.metaData.isChecked;
	},
	
	setRowChecked: function(c) {
		this.metaData.isChecked = c;
	},
	
	invertChecked: function() {
		this.metaData.isChecked = !this.metaData.isChecked;
	},
	
	isAvailable: function() {
		return this.metaData.avail;
	},

	isGrade: function() {
		return (this.colDef.isGrade());
	},
	
	isOverride: function() {
		return (this.or && this.or == "y");
	},
	
	needsGrading: function() {
		return (this.ng != null && this.ng && this.ng == "y");
	},
	
	attemptInProgress: function() {
		return (this.ip != null && this.ip && this.ip == "y");
	},
	
	isModified: function() {
		return (this.gc && this.gc == "y");
	},

	isGraded: function() {
		var tv = this.getTextValue();
		return (tv != '-' && tv.length > 0);
	},
	
	isComplete: function() {
		if (this.colDef.primarySchema instanceof Gradebook.CompleteIncompleteSchema){
			return this.isGraded();
		}else{			
			return false;
		}
	},

  isExempt: function() {
  	return (this.x == "y");
  },

	validate: function(newValue, matchPartial) {
		return this.colDef.validate(newValue, matchPartial);
	},
	
	update: function(newValue) {
		this.isUncommitted = true;
		this.gc = "y";
		this.colDef.updateGrade( newValue, this.getUserId() );
	},

	// called by CellController.renderHTML to get value for spreadsheet
	getCellValue: function() {
		return this.colDef.getCellValue( this );
	},

	// called by GridCell.getAltValue to get alt (mouse over) value for rendering in spreadsheet
	getAltValue: function(){
	    if ( this.isGrade() && !this.isGraded() ) return GradebookUtil.getMessage('noGradeMsg');
		return this.colDef.getAltValue( this );
	},

	// called by CellController.startEdit to get input value for editing
	getEditValue: function() {
		return this.colDef.getEditValue( this );
	},

	getSortValue: function() {
		return this.colDef.getSortValue( this );
	},

	getPointsPossible: function() {
		if (this.mp){
			return this.mp;
		} else if (this.colDef.points){
			return this.colDef.points;
		} else {
			return 0;
		}
	},

	getTextValue: function() {
		if (this.tv) {
			return this.tv;
		} else {
			return '-';
		}
	},

	getValue: function() {
		return this.v;
	}
};	

Gradebook.Grade = Class.create();
Object.extend(Gradebook.Grade.prototype, Gradebook.GridCell.prototype);
Object.extend (Gradebook.Grade.prototype, {     
	initialize: function(colDef, metaData) {
		Gradebook.GridCell.prototype.initialize.call(this,colDef, metaData);
	},
	
	canEdit: function(){
		return (!this.colDef.isCalculated() && !this.savingDiv);
	},

	showGradeDetails: function(){
		this.colDef.showGradeDetails( this.getUserId() );
	},
	
	onAddComment: function(evt){
		this.cellController.addGradeComment(evt, this);
		this.colDef.onAddComment( this.getUserId() );
	},
	
	exemptGrade: function(evt){
		this.cellController.stopEdit(false, true);
		this.colDef.exemptGrade( this.getUserId(), this );
	},
	
	clearExemption: function(evt){
		this.colDef.clearExemption( this.getUserId() );
	},

	onClearModified: function(){
		this.clearModifiedIndicator( );
		this.colDef.clearModifiedIndicator( this.getUserId() );
	},
	
	clearModifiedIndicator: function(){
		this.gc = null;
		if (this.cellController){
			this.cellController.renderHTML(this);
		}
	},
	
	setComments: function(studentComments, instructorComments){
		this.colDef.setComments( this.getUserId(), studentComments, instructorComments );
	},
	
	getContextMenuInfo: function(cellController) {
		if (this.colDef.isCalculated()){
			return null;
		}
		this.cellController = cellController;
		// Can add comments for non-null manual column grades & 
		// system column grades that have been overridden
		var isManual = this.colDef.isManual();
		var isExempt = this.isExempt();
		var canAddComment = (isManual && this.v != '-') || (!isManual && this.isOverride()) || isExempt;
		var menu = {
			id: "gradeCM",
			items: [
				{id: "g_360View", visible:true,
					onclick: this.showGradeDetails.bindAsEventListener(this)},
				{id: "g_addComment", visible: canAddComment,
					onclick: this.onAddComment.bindAsEventListener(this)},
				{id: "g_exemptGrade", visible: !isExempt,
					onclick: this.exemptGrade.bindAsEventListener(this)},
				{id: "g_clearExemption", visible: isExempt,
					onclick: this.clearExemption.bindAsEventListener(this)},
				{id: "g_clearModified", visible:(this.isModified()),
					onclick: this.onClearModified.bindAsEventListener(this)}
				]};
		return menu;			
	}
});

Gradebook.StudentAttribute = Class.create();
Object.extend(Gradebook.StudentAttribute.prototype, Gradebook.GridCell.prototype);
Object.extend (Gradebook.StudentAttribute.prototype, {     
	initialize: function(colDef, metaData) {
		Gradebook.GridCell.prototype.initialize.call(this,colDef, metaData);
	},
	
	onSendEmail: function(){
		var ids = new Array()
		ids[0] = this.getUserId();
		this.cellController.sendEmail('S',ids);
	},
	
	onShowUser: function(){
	    this.colDef.updateUserVisibility( this.getUserId(), true );
	},
		
	onStudentStats: function(){
	    this.colDef.model.viewStudentStats( this.getUserId() );
	},
		
	onHideUser: function(){
	    this.colDef.updateUserVisibility( this.getUserId(), false );
	},
	
	onAdaptiveReleaseUser: function(){
	    this.colDef.model.viewAdaptiveRelease( this.getUserName() );
	},
		
	canEdit: function(){
		return false;
	},
	
	getContextMenuInfo: function(cellController) {
		this.cellController = cellController;
		var menu = {
			id: "studentInfoCM",
			items: [
				{id: "si_sendEmail", visible:true,
					onclick: this.onSendEmail.bindAsEventListener(this)},
				{id: "si_hideUser", visible:!this.isHidden(),
					onclick: this.onHideUser.bindAsEventListener(this),
					receipt: 'hideStudentInlineMsg'},
				{id: "si_studentStats", visible:true,
					onclick: this.onStudentStats.bindAsEventListener(this)},
				{id: "si_adaptiveReleaseColumn", visible:true,
					onclick: this.onAdaptiveReleaseUser.bindAsEventListener(this)},
				{id: "si_showUser", visible:this.isHidden(),
					onclick: this.onShowUser.bindAsEventListener(this)}
				]};
		return menu;			
	}
});

//////////////////////////// Schemas //////////////////////////////////////

Gradebook.NumericSchema = Class.create();
Gradebook.NumericSchema.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},
	
	getGradeDistribution: function( grades, points, stats ){
		return Gradebook.PercentageSchema.prototype.getGradeDistribution( grades, points, stats );
	},
	
	// called by ColDef.getCellValue to get value for spreadsheet
	getCellValue: function( gridCell ){
		return this.getDisplayValue(gridCell.getValue(), gridCell.getPointsPossible());	
	},
	
	// this is the value that appears in the input box when editing
	getEditValue: function( gridCell ){
		return this.getCellValue( gridCell );	
	},

	getSortValue: function( gridCell ){
		return gridCell.getValue();	
	},

	// called by: this.getCellValue to get value for spreadsheet or
	//   by colDef.getDisplayValue when external pages need to convert a rawValue
	getDisplayValue: function( rawValue, points ){
		if (rawValue == '-' || rawValue.length == 0){
			return rawValue;
		}
		return NumberFormatter.getDisplayFloat( parseFloat(rawValue).toFixed(2) )
	},

	getRawValue: function(displayValue,colDef) {
		return NumberFormatter.getDotFloat( displayValue );
	},

	validate: function(newValue, matchPartial) {
		if (newValue == "" || newValue == "0" || newValue == "-") return null;
		var val = NumberFormatter.getDotFloat( newValue );
		if (!GradebookUtil.isValidFloat( val )){
			return GradebookUtil.getMessage('invalidNumberErrorMsg');
		}
		val = ''+val;
	    var idx = val.indexOf('.');
		if (idx > -1 && (val.length - idx - 1) > 4)
			return GradebookUtil.getMessage('tooManyDecimalPlacesErrorMsg');
		 else {
			return null;
		}
	}
};

Gradebook.TextSchema = Class.create();
Gradebook.TextSchema.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},

	getGradeDistribution: function( grades, points, stats ){
		return null;
	},
	
	// this is the value that appears in the input box when editing
	getEditValue: function( gridCell ){
		return this.getCellValue( gridCell );	
	},

	// called by ColDef.getCellValue to get value for spreadsheet
	getCellValue: function( gridCell ){
		return this.getDisplayValue(gridCell.getTextValue(), gridCell.getPointsPossible());	
	},

	getSortValue: function( gridCell ){
		var tv = gridCell.getTextValue().toUpperCase();
		//if (tv == '-') tv = '';
		return tv;	
	},

	// called by: this.getCellValue to get value for spreadsheet or
	//   by colDef.getDisplayValue when external pages need to convert a rawValue
	getDisplayValue: function( rawValue, points ){
		return rawValue;	
	},

	getRawValue: function(displayValue,colDef) {
		return displayValue;
	},

	validate: function(newValue, matchPartial) {
		// is any value bad?
		return null;
	}

};

Gradebook.PercentageSchema = Class.create();
Gradebook.PercentageSchema.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},
	
	// called by ColDef.getStats 
	getGradeDistribution: function( grades, points, stats ){
		var dist = new Array();
		var range = new Array();
		range.count = 0;
		range.text = 'less than 0';
		dist.push( range );
		for (var i = 0; i < 10; i++){
			range = new Array();
			range.count = 0;
			range.low = (i * 10);
			range.high = (i * 10) + ((i < 9)?9:10);
			range.text = range.low + ' - ' + range.high;
			dist.push( range );
		}
		var range = new Array();
		range.count = 0;
		range.text = 'greater than 100';
		dist.push( range );
		for (var i = 0, len = grades.length; i < len; i++){
			var percent = (points)?(parseFloat(grades[i])/parseFloat(points) * 100.0) : parseFloat(grades[i]);	
			if (percent == 100) percent -= 0.1; // 100 should fall into 90-100 bin
			var index = parseInt(percent/10.0) + 1;
			if (percent < 0) index = 0;
			if (percent > 100) index = 11;
			dist[index].count++;
		}
		dist.reverse();
		return dist;
	},

	// called by ColDef.getCellValue to get value for spreadsheet
	getCellValue: function( gridCell ){
		return this.getDisplayValue(gridCell.getValue(), gridCell.getPointsPossible());	
	},

	// this is the value that appears in the input box when editing
	getEditValue: function( gridCell ){
		return this.getCellValue( gridCell );	
	},

	getSortValue: function( gridCell ){
		return gridCell.getValue();	
	},

	// called by: this.getCellValue to get value for spreadsheet or
	//   by colDef.getDisplayValue when external pages need to convert a rawValue
	getDisplayValue: function( rawValue, points ){
		if (parseFloat(points) == 0.0 || rawValue == '-' || rawValue.length == 0){
			return rawValue;
		}
		var percent = parseFloat(rawValue)/parseFloat(points) * 100.0;	
		return NumberFormatter.getDisplayFloat( parseFloat(percent).toFixed(2) )+'%';	
	},

	getRawValue: function(displayValue,colDef) {
		var points = (colDef.points)?colDef.points:100;
		displayValue = displayValue.replace('%','');
		displayValue = NumberFormatter.getDotFloat( displayValue );
		return parseFloat(displayValue)/100.0 * parseFloat(points);	
	},

	validate: function(newValue, matchPartial) {
		newValue = newValue.replace('%','');
		if (newValue == "" || newValue == "0" || newValue == "-") return null;
		var val = NumberFormatter.getDotFloat( newValue );
		if (!GradebookUtil.isValidFloat( val )){
			return GradebookUtil.getMessage('invalidNumberErrorMsg');
		}
		val = ''+val;
	    var idx = val.indexOf('.');
		if (idx > -1 && (val.length - idx - 1) > 4)
			return GradebookUtil.getMessage('tooManyDecimalPlacesErrorMsg');
		 else {
			return null;
		}
	}

};

Gradebook.CompleteIncompleteSchema = Class.create();
Gradebook.CompleteIncompleteSchema.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},
	
	// called by ColDef.getStats 
	getGradeDistribution: function( grades, points, stats ){
		var dist = new Array();
		var range = new Array();
		range.count = stats.qtyNull;
		range.text = 'Incomplete';
		dist.push( range );
		range = new Array();
		range.count = grades.length;
		range.text = 'Complete';
		dist.push( range );
		dist.reverse();
		return dist;
	},

	// called by ColDef.getCellValue to get value for spreadsheet
	getCellValue: function( gridCell ){
		return this.getDisplayValue(gridCell.getTextValue(), gridCell.getPointsPossible());	
	},

	// this is the value that appears in the input box when editing
	getEditValue: function( gridCell ){
		return gridCell.getValue();
	},

	getSortValue: function( gridCell ){
		var tv = gridCell.getTextValue().toUpperCase();
		if (tv == '-'){
			return '-';
		} else {
			return gridCell.getValue();
		}
	},

	// called by: this.getCellValue to get value for spreadsheet or
	//   by colDef.getDisplayValue when external pages need to convert a rawValue
	getDisplayValue: function( rawValue, points ){
		if (rawValue != '-' && rawValue.length > 0){
			return '<img border="0" width="16" height="16" src="/images/ci/icons/checkmark_ia.gif" alt="' + GradebookUtil.getMessage('completedMsg') + '">';
		} else {
			return '-';
		}
	},

	getRawValue: function(displayValue,colDef) {
		return displayValue;
	},

	validate: function(newValue, matchPartial) {
		if (newValue == "" || newValue == "0" || newValue == "-") return null;
		// todo: determine what is allowed. I.E. is "-" allowed?
		// allow empty string or number
//		return (newValue.length == 0 || parseFloat(newValue));
		if (!GradebookUtil.isValidFloat(newValue)){
			return GradebookUtil.getMessage('invalidNumberErrorMsg');
		} else {
			return null;
		}
	}
};

Gradebook.LetterSchema = Class.create();
Gradebook.LetterSchema.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},
	
	// called by ColDef.getStats 
	getGradeDistribution: function( grades, points, stats ){
		var dist = new Array();
		var symMap = new Array();
		this.symbols.each(function(s) {
			var range = new Array();
			range.count = 0;
			range.text = s.sym;
			symMap[s.sym] = dist.length;
			dist.push( range );
		});
		for (var i = 0, len = grades.length; i < len; i++){
			var val = this.getDisplayValue(grades[i], points);	
			var index = symMap[val];
			if (index != undefined){
				dist[index].count++;
			}
		}
		return dist;
	},

	// called by ColDef.getCellValue to get value for spreadsheet
	getCellValue: function( gridCell ){
		return this.getDisplayValue(gridCell.getValue(), gridCell.getPointsPossible());	
	},

	// this is the value that appears in the input box when editing
	getEditValue: function( gridCell ){
		return this.getCellValue( gridCell );	
	},

	getSortValue: function( gridCell ){
		return gridCell.getValue();	
	},

	// called by: this.getCellValue to get value for spreadsheet or
	//   by colDef.getDisplayValue when external pages need to convert a rawValue
	getDisplayValue: function( rawValue, points ){

		if (parseFloat(points) == 0.0 || rawValue == '-' || rawValue.length == 0){
			return rawValue;
		}
		var percent = parseFloat(rawValue)/parseFloat(points) * 100.0;	
		percent = percent.toFixed(2);	
		if (!parseFloat(percent) && percent != 0){
			// see if raw value is one of the symbols
			var matchingSymbol;
			rawValue = rawValue.toUpperCase();
			this.symbols.each(function(s) {
				if (rawValue == s.sym.toUpperCase()){
					matchingSymbol = s.sym;
					throw $break; // needed to get out of each loop
				}
			});
			if (matchingSymbol){
				return matchingSymbol;
			} else {
				return rawValue;
			}
		}
		var retVal = rawValue;
		this.symbols.each(function(s) {
			if (percent >= s.lb && percent <= s.ub){
				retVal = s.sym;
				throw $break; // needed to get out of each loop
			}
		});
		return retVal;
	},

	getRawValue: function(displayValue,colDef) {

//What it SHOULD be doing is:
//Column created with Letter as primary display and secondary display of % - worth 10 points
//Enter A - go to schema and determine that A = 95% use 95% to determine score of 9.5 - store 9.5 and display A
//Enter 9 - determine the 9 is 90% (item is out of 10) 90% is an A - store 9 and display A 

		var points = (colDef.points)?colDef.points:100;
		displayValue = ''+displayValue;
		displayValue = displayValue.replace('%','');
		var score = displayValue.toUpperCase();
		var score;
		this.symbols.each(function(s) {
			if (score == s.sym.toUpperCase()){
				score = (parseFloat(s.abs)/100.0) * points;
				throw $break; // needed to get out of each loop
			}
		});
		return score;
	},

	validate: function(newValue, matchPartial) {
		if (newValue == "" || newValue == "0" || newValue == "-") return null;
		// allow numeric value for letter schemas too
		if (GradebookUtil.isValidFloat(newValue)){
			return null;
		}
		var retVal = GradebookUtil.getMessage('invalidLetterErrorMsg');
		newValue = newValue.toUpperCase();
		this.symbols.each(function(s) {
			if (newValue == s.sym.toUpperCase() || 
				(matchPartial && s.sym.toUpperCase().startsWith(newValue)) ){
				retVal = null;
				throw $break; // needed to get out of each loop
			}
		});
		return retVal;
	}
};

//////////////////////////// Custom View //////////////////////////////////////


Gradebook.CustomView = Class.create();
Gradebook.CustomView.prototype = {
	initialize: function(jsonObj, model) {
		this.model = model;
		Object.extend(this, jsonObj); // assign json properties to this object
	},

	// evaluate this custom view; determine userIds & itemIds for view
	// returns false if the formula cannot be evaluated, else true
	evaluate: function( ) {
	    try {
			this.userIds = new Array();
			this.colIds = new Array();
			this.aliasMap = new Array();
			for (var i = 0, len = this.aliases.length; i < len; i++){
				this.aliasMap[this.aliases[i].key] = this.aliases[i].val;
			}
			if (this.formula){
				this._evaluateAdvanced();
			} else {
				this._evaluateBasic();
			}
			this._computeDisplayItems();
			return true;
	    } catch (e) {
			return false;
	    }
	},

	usesGroups: function( ) {
		for (var i = 0, len = this.aliases.length; i < len; i++){
			if (this.aliases[i].key.startsWith('gr')){
				return true;
			}
		}
		return false;
	},

	getUserIds: function() {
		return this.userIds;
	},

	getDisplayItemIds: function() {
		return this.colIds;
	},

	_computeDisplayItems: function() {
		// map aliased ids to real ids
		if (this.display.ids){
			this.display.unAliasedIds = new Array();
			for (var i = 0, len = this.display.ids.length; i < len; i++){
				var id = this.aliasMap[this.display.ids[i]];	
				if (id == undefined) throw 'missing alias';
				this.display.unAliasedIds.push( id );
			}
		}
		var colDefs = this.model.getColDefs( false, this.display.showhidden );
		var dispType = this.display.items.toUpperCase();
		if (dispType == "BYITEM"){ 
			this.colIds = this._getItemsById();
		} else if (dispType == "INCRI"){ // in criteria
			this.colIds = this._getItemsInCriteria();
		} else if (dispType == "BYCAT"){ // by category
			this.colIds = this._getItemsByCategoryId( colDefs );
		} else if (dispType == "BYGP"){ // by grading period
			this.colIds = this._getItemsByGradingPeriodId( colDefs );
		} else if (dispType == "ALLITEM"){
			this.colIds = this._getAllItems( colDefs );
		} else if (dispType == "IVS"){
			this.colIds = this._getItemsByVisibilityToStudents( colDefs, true );
		} else if (dispType == "INVS"){
			this.colIds = this._getItemsByVisibilityToStudents( colDefs, false );
		} else if (dispType == "NOITEM"){ 
			this.colIds = new Array()
		}
	},

	_getItemsById: function() {
		return this.display.unAliasedIds;	
	},

	_getItemsInCriteria: function() {
		var itemIds = new Array();
		// get items that are used in criteria; which are in aliases
		for (var i = 0, len = this.aliases.length; i < len; i++){
			if (this.aliases[i].key.startsWith('I_')){
				itemIds.push( this.aliases[i].val );
			}
		}
		return itemIds;
	},

	_getItemsByCategoryId: function( colDefs ) {
		var itemIds = new Array();
		// get items that have category id in display.ids
		for (var i = 0, len = colDefs.length; i < len; i++){
			if (this.display.unAliasedIds.indexOf( colDefs[i].catid ) != -1){	
				itemIds.push( colDefs[i].id );
			}
		}
		return itemIds;
	},

	_getItemsByGradingPeriodId: function( colDefs ) {
		var itemIds = new Array();
		// get items that have grading period id in display.ids
		for (var i = 0, len = colDefs.length; i < len; i++){
			if (this.display.unAliasedIds.indexOf( colDefs[i].gpid ) != -1){	
				itemIds.push( colDefs[i].id );
			}
		}
		return itemIds;
	},

	_getItemsByVisibilityToStudents: function( colDefs, vis ) {
		var itemIds = new Array();
		// get items that have grading period id in display.ids
		for (var i = 0, len = colDefs.length; i < len; i++){
			if ( colDefs[i].vis == vis ){	
				itemIds.push( colDefs[i].id );
			}
		}
		return itemIds;
	},

	_getAllItems: function( colDefs ) {
		var itemIds = new Array();
		for (var i = 0, len = colDefs.length; i < len; i++){
			itemIds.push( colDefs[i].id );
		}
		return itemIds;
	},

	_evaluateBasic: function() {
		if ( this.students.userIds && this.students.userIds[0] != "all") {
			var uids = this.students.userIds;
			for (var i = 0, len = uids.length; i < len; i++){
				var id = this.aliasMap[uids[i]];
				if (id == undefined) throw 'missing alias'
				this.userIds.push( id );
			}
		} else { // all students
			var showstuhidden = this.students.showstuhidden;
			var modelStudents = this.model.getStudents( showstuhidden );
			for (var i = 0, len = modelStudents.length; i < len; i++){
				this.userIds.push( modelStudents[i].id );
			}
		}
	},

	_evaluateAdvanced: function() {
		// lazily compute postfix formula & criteriaMap
		if (!this.postFixFormula){
			this.postFixFormula = this.infix2postfix( this.formula );
		}
		if (!this.criteriaMap){
			this.criteriaMap = new Array();
			for (var i = 0, len = this.criteria.length; i < len; i++){
				this.criteriaMap[this.criteria[i].fid] = i;
			}
		}
		// test each row and add to userIds if it passes formula
		var rows = this.model.rows;
		for (var i = 0, len = rows.length; i < len; i++){
			if ( this._evaluateFormulaForRow( rows[i] ) ){
				this.userIds.push( rows[i][0].getUserId() );
			}
		}
	},

	_evaluateFormulaForRow: function( row ) 
	{
		// only one criteria in formula
		if (this.postFixFormula.length == 1){
			return this._evalCriteria( this.postFixFormula[0], row );
		}
		// evaluate postfix formula:
		//   * push non-operators on stack
		//   * when operators are encountered:
		//		pop two operands off stack
		//		evaluate operands (criteria)
		//		apply operator to the two evaluated operands
		//		store result on stack
		//	 * pop & return final result
		var stack = new Array();
		for (var i = 0, len = this.postFixFormula.length; i < len; i++){
			var tok = this.postFixFormula[i];
			switch (tok){
				case "AND": 
				case "OR": 
					if (stack.length < 2)
							throw (this.model.getMessage('custViewStackEmptyMsg') + tok);
					var op2 = stack.pop();
					var op1 = stack.pop();
					var firstValue = op1 ;
					if ( typeof(op1) == 'string' ) firstValue =  this._evalCriteria( op1, row );
					var secondValue = op2; 
					if ( typeof(op2) == 'string' ) secondValue = this._evalCriteria( op2, row );
					if (tok == "AND") 
						stack.push( ( firstValue && secondValue) );
					else if (tok == "OR")
						stack.push( (firstValue || secondValue) );
					break;
				default:
					stack.push(tok); 
					break;
			}
		}
	    if (stack.length != 1)
			throw this.model.getMessage('custViewUnableToEvaluateMsg');
	    else
	        return stack.pop();
	},

	_getAliasOrId: function( id ) {
		if ( id.startsWith('I_') || id.startsWith('c_') || id.startsWith('gp_') 
			    		|| id.startsWith('gr_') || id.startsWith('st_')  ){
			return this.aliasMap[id];	
		} else {
			return id;
		}		
	},


	_evalCriteria: function( fid, row ) 
	{
		// look up criteria by fid
		var crit = this.criteria[ this.criteriaMap[fid] ];	
		var colId = this._getAliasOrId( crit.cid );	
		if (colId == undefined){
			throw 'missing alias'
		}
		var colDefMap = this.model.colDefMap;
		var colIdx = colDefMap[colId];
		if ( colId == 'SV' || colId == 'GM') colIdx = 0;
		if (colIdx == undefined) {
			throw 'missing alias'
		}
		var gridCell = row[colIdx];
		var evalFunc = this._getEvalCriteriaFunc( crit );
		return evalFunc( crit, gridCell );
	},

	_evalAvailableCriteria: function( crit, gridCell ) 
	{
		var avail = (gridCell.isAvailable())?"A":"U";
		return crit.value == avail;	
	},

	_evalStatusCriteria: function( crit, gridCell ) 
	{
		if (crit.value == 'IP')
			return gridCell.attemptInProgress();
		else if (crit.value == 'NG')
			return gridCell.needsGrading();
		else if (crit.value == 'NU')
			return gridCell.getSortValue() == '-';
		else if (crit.value == 'X')
			return gridCell.isExempt();
	},

	_evalStudentVisibleCriteria: function( crit, gridCell ) 
	{
		var avail = (gridCell.isHidden())?"H":"V";
		return crit.value == avail;	
	},

	_evalGroupMembershipCriteria: function( crit, gridCell ) 
	{
		// There may be 1 or more values passed. We allow multiple selection of Groups
		var result = (crit.cond == "eq") ? false : true;
		var groupNames = crit.value.split(",");
		for (var i = 0, len = groupNames.length; i < len; i++)
		{
			var groupId = this.aliasMap[groupNames[i]];
			if (groupId == undefined) throw 'missing alias'
			var userId = gridCell.getUserId();
			var inGroup = this._userIsInGroup( userId, groupId );
			result = ( (crit.cond == "eq") ? result || inGroup : result && !inGroup ) ;
    }
    return result;
	},

	_evalLastAccessedCriteria: function( crit, gridCell ) 
	{
		var cellVal = gridCell.getSortValue();
        if (crit.cond == "eq"){
        	var numMSecPerDay = 1000*60*60*24;
        	var v1 = parseInt(cellVal/numMSecPerDay);
        	var v2 = parseInt(crit.value/numMSecPerDay);
            return (v1 == v2);
		}
        else if (crit.cond == "be")
            return (cellVal < crit.value);
        else if (crit.cond == "af")
            return (cellVal > crit.value);
	},

	_defaultEvalCriteria: function( crit, gridCell ) 
	{
		var cellVal = gridCell.getSortValue();
		if (gridCell.attemptInProgress() || gridCell.needsGrading() || (cellVal == '-') || gridCell.isExempt())
		{
			return false;
		}
		var operator = crit.cond;
		var critVal = gridCell.colDef.getRawValue( crit.value );
		if (this._isNumber(cellVal) && this._isNumber(critVal))
        {
            var dblCellVal = this._toNumber(cellVal);
            var dblCritVal = this._toNumber(critVal);
            var dblCritVal2 = (crit.value2 != undefined)?this._toNumber(gridCell.colDef.getRawValue( crit.value2 )):0;
            if (operator == "eq")
                return (dblCellVal == dblCritVal);
            else if (operator == "neq")
                return (dblCellVal != dblCritVal);
            else if (operator == "gt")
                return (dblCellVal > dblCritVal);
            else if (operator == "lt")
                return (dblCellVal < dblCritVal);
            else if (operator == "le")
                return (dblCellVal <= dblCritVal);
            else if (operator == "ge")
                return (dblCellVal >= dblCritVal);
            else if (operator == "bet")
                return ((dblCritVal <= dblCellVal) && (dblCellVal <= dblCritVal2)) ;
		}
        else if (typeof(cellVal) == "string" && typeof(critVal) == "string")
        {
        	cellVal = cellVal.toUpperCase();
        	critVal = critVal.toUpperCase();
            if (operator == "eq")
                return (cellVal == critVal);
            else if (operator == "neq")
                return (cellVal != critVal);
            else if (operator == "bw")
                return (cellVal.startsWith( critVal ));
            else if (operator == "con")
                return (cellVal.indexOf( critVal ) != -1 );
        }
        else
			throw (this.model.getMessage('custViewDataTypeMismatchMsg')+' '+crit.fid);
	},

	_getEvalCriteriaFunc: function( crit ) 
	{
		if (!this.evalCriteriaFuncMap)
		{
			this.evalCriteriaFuncMap = new Array();
			this.evalCriteriaFuncMap["AV"] = this._evalAvailableCriteria.bind(this);
			this.evalCriteriaFuncMap["SV"] = this._evalStudentVisibleCriteria.bind(this);
			this.evalCriteriaFuncMap["LA"] = this._evalLastAccessedCriteria.bind(this);
			this.evalCriteriaFuncMap["GM"] = this._evalGroupMembershipCriteria.bind(this);
		}
		var func = this.evalCriteriaFuncMap[crit.cid];
		if (!func) 
		{
			if (crit.cond == 'se')
			{
				func = this._evalStatusCriteria.bind(this);
			}
			else
			{
				func = this._defaultEvalCriteria.bind(this);
			}
		}
		return func;	
	},

	_userIsInGroup: function( userId, groupId ) 
	{
		var groups = this.model.groups;
		for (var i = 0, len = groups.length; i < len; i++){
			if ( groups[i].id == groupId ){
				return (groups[i].uids.indexOf( userId ) != -1);
			}
		}
		return false;
	},

	getValidationError: function( f , criteriaLst ) 
	{
		try 
		{
			var postFix = this.infix2postfix( f,criteriaLst );
			return null;
		} 
		catch (e)
		{
			return e;
		}
	},

	infix2postfix: function( formula,criteriaLst ) 
	{
		var f = formula;
		f = f.gsub( /\(/,' ( '); // add spaces around parens
		f = f.gsub( /\)/,' ) '); // add spaces around parens
		var a = $w(f); // split into array
		var stack = new Array();
		var out = new Array();
		for (var i = 0, len = a.length; i < len; i++){
			var tok = a[i].toUpperCase();
			switch (tok){
				case "AND": 
				case "OR": 
					while( this._isOperator(stack[stack.length-1]) ){
						out.push(stack.pop()); 
					}
					stack.push(tok.toUpperCase()); 
					break;
				case "(": 
					stack.push(tok); 
					break;
				case ")": 
					foundStart = false;
					while(stack.length > 0){
						tok = stack.pop(); 
						if ( tok == "(" ){
							foundStart = true;
							break;
						} else {
							out.push(tok); 
						}
					}
					if (stack.length == 0 && !foundStart)
						throw (this.model.getMessage('custViewMismatchedParensMsg')+' '+this.name);
					break;
				default:
				    if ( criteriaLst && criteriaLst.indexOf(tok)  == -1 ) 
						throw this.model.getMessage('criteriaNotFoundMsg');
					out.push(tok); 
					break;
			}
		}
		while(stack.length > 0){
			tok = stack.pop();
			if (tok == '(')
				throw (this.model.getMessage('custViewMismatchedParensMsg')+' '+this.name);
			out.push(tok); 
		}
		return out;
	},
	
	_isOperator: function(s) {	return (s=='OR' || s=='AND');	},
	_isNumber: function( s )	{  return (isNaN( new Number(s) ) ? false : true);	},

	_toNumber: function( s ) 
	{
	    if (typeof(s) == "number")
	        return s;
	    else
	    {
	        var n = new Number(s);
	        return n.valueOf();
	    }
	}


};


//////////////////////////// Utility //////////////////////////////////////

Gradebook.GridRowIterator = Class.create();
Gradebook.GridRowIterator.prototype = {
	initialize: function(dataArray, orderMap, startIndex) {
		this.dataArray = dataArray;
		this.orderMap = orderMap;
		this.currentIndex = startIndex;
	},
	hasNext: function() {return this.currentIndex < this.orderMap.length;},
	next: function() {
		if (this.currentIndex >= this.orderMap.length) {
			GradebookUtil.error('GridRowIterator out of data. length = '+this.orderMap.length);
			return null;
		}
		return this.dataArray[this.orderMap[this.currentIndex++]];
	}
};

Gradebook.numberComparator = function( a, b ) { return a - b; }

var NumberFormatter = {
  
  // usually called from frameset scope and re-set when grid is initialized with grid page LOCALE SETTINGS
  needToConvert: (LOCALE_SETTINGS.getString('number_format.decimal_point') == ','),
  
  getDisplayFloat: function ( f ) {
	if (!NumberFormatter.needToConvert) return f;
	f = ''+f;
	return f.replace('.',',');
   },

  getDotFloat: function ( f ) {
	if (!NumberFormatter.needToConvert) return f;
	f = ''+f;
	return f.replace(',','.');
   }
};


