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
  * File: $Workfile: $
  * Authors(s): Bill Richard
  * Description: Main controller class for gradebook2 grid.
  * Version: $Revision: $ $Date: $
  **/

var Gradebook = {
  Version: '1.0.0',
  prototypeVersion: parseFloat(Prototype.Version.split(".")[0] + "." + Prototype.Version.split(".")[1]),
  getModel: function() {
  	if (window.gbModel) return window.gbModel; // in case scope is GC/Course Frameset
  	return parent.gbModel; 
  },
  clearModel: function() {parent.gbModel = null; }
}


Gradebook.Grid = Class.create();

Gradebook.Grid.prototype = {

   initialize: function( tableId, gradebookService, options, model) {

     this.options = {
			scrollerBorderRight: '1px solid #ababab',
			sortBlankImg: 'images/blank.gif',
			sortAscendImg: '/images/ci/icons/sort_on_up.gif',
			sortDescendImg: '/images/ci/icons/sort_on.gif',
			topArrowLImg: 'images/toparrowL.gif',
			topArrowRImg: 'images/toparrowR.gif',
			botArrowLImg: 'images/botarrowL.gif',
			botArrowRImg: 'images/botarrowR.gif',
			numFrozenColumns: 0,
			sortImageWidth: 9,
			sortImageHeight: 5,
			accessibleMode: false
                };
		Object.extend(this.options, options || {});

		this.tableId     = tableId; 
		this.table       = $(tableId);

		this.currentSelectedCell = null;

		if (model){
			this.model = model;
  			this.model.removeModelListeners();
  			this.model.gradebookService = gradebookService;
  		} else {
			this.model = new Gradebook.GridModel(gradebookService);
  		}
		this.model.addModelListener(this);
		if (this.model.getNumColDefs() == 0)
			this.model.requestLoadData();
		else
			this.model.requestUpdateData();
		if ( this.options.accessibleMode ) {
		    this.changeTitleToBasicView();
		}
   },
   
   changeTitleToBasicView: function() {
        document.title = gradebook2Messages.pageTitleBasicView;
        $('pageTitleText').innerHTML = gradebook2Messages.pageTitleBasicView;
   },

	modelChanged: function() {
		$('loadStatusMsg').update(GradebookUtil.getMessage('creatingGridMsg'));
		this.model.removeModelListeners();
		setTimeout(this.createView.bind(this), 50 );
	},

	modelError: function(msg, serverReply) {
		model = null;
		parent.gbModel = null;
		if (serverReply && !serverReply.startsWith('{"dataFormat":')){
			// server returned error page instead of json data
			document.write( serverReply );
			document.close();
		} else {
			window.location.href = showErrorURL+'&msg='+msg;
		}
	},

	createView: function() {
		this.options.numFrozenColumns = model.getNumFrozenColumns();
		this.modelSortIndex = this.model.getSortIndex();
		this.sortDir = this.model.getSortDir();
		this._initializeHTML();
		this.viewPort =  new Gradebook.GridViewPort(this.table, this.model, this.options, this);
		this.model.addModelListener(this.viewPort);
		this._setAccessibilityHeaders();
		if ( this.options.onLoadComplete ){
			this.options.onLoadComplete();
		}
		this.viewPort.refreshContentsH();
		this.updateSortImage();
		this.restoreFocus();
	},

	setAccessibleViewportSize: function( grid ) {
		// container div will scroll in accessible mode
		var contDiv = $(grid.tableId+'_container');
		var h = Math.min(grid.options.tableHeight,grid.table.offsetHeight+19);
		var w = Math.min(grid.options.tableWidth,grid.table.offsetWidth+19);
		contDiv.style.height = h + "px";
		contDiv.style.width = w + "px";
		contDiv.style.overflow = "auto";
	},

	_initializeHTML: function() {
		this._sizeHTMLTable();

		// wrap table with a new container div
		new Insertion.Before(this.table, "<div id='"+this.tableId+"_container'></div>");
		this.table.previousSibling.appendChild(this.table);

		if (!this.options.accessibleMode){
			// wrap table with a new viewport div
			new Insertion.Before(this.table,"<div id='"+this.tableId+"_viewport'></div>");
			this.table.previousSibling.appendChild(this.table);
			var viewportDiv = $(this.tableId+'_viewport');
			viewportDiv.style.height = (this.table.offsetHeight) + "px";
			viewportDiv.style.overflow = "hidden";
		} else {
			this.setAccessibleViewportSize( this );
		}

		if (!this.options.accessibleMode){
			// add controllers to table cells
			var numRows = this.table.rows.length;
			for (var r = 0; r < numRows; r++){
				var numCols = this.table.rows[0].cells.length;
				for (var c = 0; c < numCols; c++){
					var cell = this.table.rows[r].cells[c];
					new Gradebook.CellController(cell, this, r, c);
				}
			}
			var tableHeader = $(this.table.id + '_header');
			if (tableHeader){
				var numHCols = tableHeader.rows[0].cells.length;
				for (var c = 0; c < numHCols; c++){
					new Gradebook.CellController(tableHeader.rows[0].cells[c], this, 0, c);
					if (c == 1 ){
						var contextMenuAnchor = GradebookUtil.getChildElementByClassName(tableHeader.rows[0].cells[c], 'a', 'cmimg');
						if (contextMenuAnchor) $(contextMenuAnchor).hide();
					}
				}
			}
		}
		if (document.onClickHandler){
			Event.stopObserving(document,'click',document.onClickHandler);
		}
		document.onClickHandler = this.onDocumentClickHandler.bindAsEventListener(this);
		Event.observe(document,'click',document.onClickHandler);
		
		if (document.onKeydownHandler){
			Event.stopObserving(document,'keydown',document.onKeydownHandler);
		}
		document.onKeydownHandler = this.onDocumentKeyDownHandler.bindAsEventListener(this);
		Event.observe(document,'keydown',document.onKeydownHandler);
	},

	unload: function() {
		Gradebook.CellController.prototype.removeAllSavingDivs();
		var numRows = this.table.rows.length;
		for (var r = 0; r < numRows; r++){
			var numCols = this.table.rows[0].cells.length;
			for (var c = 0; c < numCols; c++){
				var cell = this.table.rows[r].cells[c];
				if (cell.controller)
				{
					cell.controller.unload();
				}
			}
		}
		var tableHeader = $(this.table.id + '_header');
		if (tableHeader){
			var numHCols = tableHeader.rows[0].cells.length;
			for (var c = 0; c < numHCols; c++){
				var cell = tableHeader.rows[0].cells[c];
				if (cell.controller)
				{
					cell.controller.unload();
				}
			}
		}
		if (this.viewPort) this.viewPort.unload();
		this.model.removeModelListeners();
		this.table = null;
		this.model = null;
		this.viewPort = null;
		this.options = null;
		this.sortCell = null;
	},

	_sizeHTMLTable: function() {
		var tbl = this.table;
		var tableHeader = $(this.table.id + '_header');
		var numRows = 0;
		var numCols = 0;  
		var numFrozenColumns = this.options.numFrozenColumns;
		// presence of th impacts the calculation of the row height
		// so we remove it before the calculation occurs
		if (numFrozenColumns == 0){
			for (var i=0; i<tbl.rows.length; i++) {
				tbl.rows[i].deleteCell(1);
				tableHeader.rows[i].deleteCell(1);
			}
			// region is now too small to display msg and count
			$("selectedRowMsg").style.display='none';
		}
		else
		{
			$("selectedRowMsg").style.display='inline';
		}		
		if (this.options.accessibleMode){
			numRows = this.model.getNumRows();
			numCols = this.model.getNumColDefs();  
		} else {
			var cell = this.table.rows[this.table.rows.length-1].cells[1]; // skip checkbox column
			cell.height = cell.offsetHeight;
			numRows = parseInt(this.options.tableHeight/cell.offsetHeight);
			numCols = parseInt(this.options.tableWidth/cell.offsetWidth);
		}
		if (this.model.getNumRows() <= numRows) {
			numRows = this.model.getNumRows() + 1; // add one row for header
			if (this.model.getNumRows() == 0){
				numRows = 0;
			}
		}

		// at least one non-frozen column must be shown
		if (numFrozenColumns+1 >= numCols){
			numFrozenColumns = numCols-1;
			this.options.numFrozenColumns = numFrozenColumns;
		}
		
		// assumes the table has at least 1 row & 2 cols
		// the first column is a frozen column
		// the second column is a non-frozen column

		// clone frozen columns
		for (var i = 0; i < numFrozenColumns-1; i++){
			this._cloneColumn(1); // skip check box column
		}


		// clone non-frozen columns
		var numNonFrozenColumns = numCols - numFrozenColumns - 1;
		for (var i = 0; i < numNonFrozenColumns; i++){
			this._cloneColumn(numFrozenColumns+1); // skip check box column
		}

		
	    var checkColumnWidth = this.table.rows[0].cells[0].offsetWidth;
	    var visibleWidth = this.table.offsetWidth;
	    this.avgColWidth = (visibleWidth - checkColumnWidth)/numCols;
	    var frozenWidth = (numFrozenColumns * this.avgColWidth) + checkColumnWidth;
        $("selectedRows").style.width=this.isIE?frozenWidth + "px": frozenWidth-2 +"px";
		
		
		// clone rows
		var numRowsToAdd = numRows - tbl.rows.length;
		if (tableHeader) numRowsToAdd--;
		
		var rowToClone = tbl.rows[this.table.rows.length-1];
		for (var i = 0; i < numRowsToAdd; i++){
			tbl.tBodies[0].appendChild(rowToClone.cloneNode(true));
		}

		// remove table rows if html table is bigger than numRows
		while (tbl.rows.length > numRows){
			if (tbl.rows.length > 0) tbl.deleteRow(tbl.rows.length - 1);
		}

		// remove table columns if html table is bigger than model
		var allRows = tbl.rows;	
		while (tbl.rows.length > 0 && tbl.rows[0].cells.length-1 > this.model.getNumColDefs()){
			for (var i=0; i<allRows.length; i++) {
				if (allRows[i].cells.length > 1) {
					allRows[i].deleteCell(-1);
				}
			}
		}
		while (tableHeader && tableHeader.rows[0].cells.length-1 > this.model.getNumColDefs()){
			tableHeader.rows[0].deleteCell(-1);
		}
	},

	_cloneColumn: function(colIndex){
		var tbl = this.table;
		for (var i = 0; i < tbl.rows.length; i++) {
			var origCell = tbl.rows[i].cells[colIndex]; 
			var newCell = origCell.cloneNode(true);
			tbl.rows[i].insertBefore(newCell,origCell);
		}
		var tableHeader = $(this.table.id + '_header');
		if (tableHeader){
			var tbl = tableHeader;
			for (var i = 0; i < tbl.rows.length; i++) {
				var origCell = tbl.rows[i].cells[colIndex]; 
				var newCell = origCell.cloneNode(true);
				tbl.rows[i].insertBefore(newCell,origCell);
			}
		}
	},      

	/*
		add abbreviation for each th, abbr will equal cell value
			<TH id="col3" abbr="Type">Type of Coffee</TH>
		add headers for each td, space separated
			  <td headers="col3 row1 row1a"><div>
	*/
	
	_setAccessibilityHeaders: function(){
		if (!this.options.accessibleMode){
			return;
		}
		var tbl = this.table;
		if ( tbl.rows.length>1 && tbl.rows[1].cells.length > 1 ) {
		  for ( var i = 1; i < tbl.rows.length; i++ ) {
		    tbl.rows[i].cells[1].scope = 'row';
		  }
		}
	},      

	onDocumentClickHandler: function(evt) {
		Gradebook.CellController.prototype.documentClicked(evt);
	},

	onDocumentKeyDownHandler: function(evt) {
		GradebookUtil.debug('onDocumentKeyDownHandler keyCode = '+evt.keyCode);
		if (!Gradebook.CellController.prototype.tableHasFocus){
			return;
		}
		var ek=evt.keyCode;
		var visibleRowCount = this.viewPort.getNumVisibleRows();
		var deltaRow = 0;
		var deltaCol = 0;
		switch (ek) {
			case (Event.KEY_LEFT):		deltaCol = -1; break;
			case (Event.KEY_RIGHT):		deltaCol = 1; break;
			case (Event.KEY_UP):		deltaRow = -1; break;
			case (Event.KEY_DOWN):		deltaRow = 1; break;
			case (33/* page up */):		if ( !this.options.accessibleMode ) deltaRow = -visibleRowCount; break;
			case (34/* page down */):	if ( !this.options.accessibleMode ) deltaRow = visibleRowCount; break;
			case (Event.KEY_RETURN):
			{
			   if ( this.options.accessibleMode 
			        && Gradebook.CellController.currentSelectedCell 
			        && Event.element( evt ).className=='titleAnchor' 
			      )
			   {
			        var cellController = Gradebook.CellController.currentSelectedCell.controller;
			   		var gridcell = cellController.getGridCell();
            		if ( gridcell.canEdit() ) {
            		   // not prefect: if the row is sorted, then it will highlight the same location
            		   // but this will be now another user grade.
            		   Gradebook.getModel().lastFocusedRow = cellController.row;
            		   Gradebook.getModel().lastFocusedCol = cellController.col;
            		   gridcell.showGradeDetails();
            		}
			   }
			}
		}
		if (deltaRow == 0 && deltaCol == 0) {
			return;
		} else {
			evt.cancelBubble = true;
			this.selectRelativeCell(deltaRow, deltaCol);
			Gradebook.CellController.prototype.closePopups(evt);
		}
	},

	selectRelativeCell: function(deltaRow, deltaCol) {
		var visibleRowCount = this.viewPort.getNumVisibleRows();
		var visibleColumnCount = this.viewPort.getNumVisibleCols();
		var modelRowCount = this.model.getNumRows();
		var modelColumnCount = this.model.getNumColDefs();

		var cellController = this.currentCellController;
		if (Gradebook.CellController.currentSelectedCell != null){
			cellController = Gradebook.CellController.currentSelectedCell.controller;
		}
		var currentSelectedRow = cellController.row;
		var currentSelectedCol = cellController.col - 1; // skip checkbox col
		var selectDelay = 100;

		currentSelectedRow += deltaRow;
		if (currentSelectedRow < 0 || currentSelectedRow >= visibleRowCount){
			currentSelectedRow -= deltaRow;
			selectDelay = 500; // need longer delay to select cell until scroll completes
			if (this.viewPort.scrollRows(deltaRow) == false) {
				if (deltaRow < 0){ 
					// wrap to bottom of previous col
					if (currentSelectedCol == 0) return;
					deltaRow = modelRowCount - visibleRowCount;
					currentSelectedRow = visibleRowCount - 1;
					currentSelectedCol -= 1;
				} else {
					// wrap to top of next col
					deltaRow = visibleRowCount - modelRowCount;
					currentSelectedRow = 0;
					if (currentSelectedCol < visibleColumnCount-1){ 
						currentSelectedCol += 1;
					} else {
						this.viewPort.scrollCols(1);
					} 
				}
				this.viewPort.scrollRows(deltaRow);
			}
		}
		currentSelectedCol += deltaCol;
		if ((currentSelectedCol < this.options.numFrozenColumns && deltaCol < 0)
			|| currentSelectedCol >= visibleColumnCount){
			currentSelectedCol -= deltaCol;
			selectDelay = 500; // need longer delay to select cell until scroll completes
			if (this.viewPort.scrollCols(deltaCol) == false) {
				if (deltaCol < 0){ 
					if (currentSelectedCol > 0) { // navigate in frozen columns
						currentSelectedCol += deltaCol;
					} else {
						// wrap to end of previous row
						if (currentSelectedRow == 0) return;
						deltaCol = modelColumnCount - visibleColumnCount;
						currentSelectedCol = visibleColumnCount - 1;
						currentSelectedRow -= 1;
					}
				} else {
					// wrap to beginning of next row
					deltaCol = visibleColumnCount - modelColumnCount;
					currentSelectedCol = 0;
					if (currentSelectedRow < visibleRowCount-1){ 
						currentSelectedRow += 1;
					} else {
						this.viewPort.scrollRows(1);
					} 
				}
				this.viewPort.scrollCols(deltaCol);
			}
		}
		// select the current cell after servicing the main event loop to allow current events to complete
		// this was needed for AS-110508 to apply the left/right arrow event to cell navigation only and not to cell editing too.
		this.currentCellController = this.table.rows[currentSelectedRow].cells[currentSelectedCol+1].controller;
		setTimeout(this.selectCell.bind(this), selectDelay );
	},
	
	selectCell: function() {
		this.currentCellController.selectCell();
	},

	sortColumn: function(newSortCell,sortDir) {
		if (newSortCell != this.sortCell) {
			this.sortDir = 'ASC';
			if (this.sortCell) {
				this.sortCell.setSortImage('NO_SORT');	// remove current sort image
			}
		} else {
			this.sortDir = (this.sortDir == 'ASC')?'DESC':'ASC'; // toggle
		}
		if (sortDir){
			this.sortDir = sortDir;
		}
		this.sortCell = newSortCell;
		this.sortCell.setSortImage(this.sortDir);	// show new sort image
		
		// sort the model
		this.modelSortIndex = this.viewPort.toModelIndex(this.sortCell.col-1); // skip checkbox column
		this.model.sort(this.modelSortIndex,this.sortDir);
		
		// refresh the view
     	this.viewPort.moveScroll(0);
		this.viewPort.refreshContents(0);
	},

	updateSortImage: function(){
		if (!this.viewPort){
			return;
		}
		if (this.sortCell) {
			this.sortCell.setSortImage('NO_SORT');	// remove current sort image
		}
		var viewSortIndex = this.viewPort.toViewIndex(this.modelSortIndex);
		if (viewSortIndex < 0){
			this.sortCell = null;
		} else {
			var headerTable = $(this.table.id + '_header');
			if (!headerTable){
				return;
			}
			this.sortCell = headerTable.rows[0].cells[viewSortIndex+1].controller; // add 1 to account for check column			
			this.sortCell.setSortImage(this.sortDir);
		}
	},
	
	//focused is restored only in AX view since user has to leave the page for update
	restoreFocus: function() {
	   if ( !this.options || !this.options.accessibleMode || !Gradebook.getModel().lastFocusedRow || !Gradebook.getModel().lastFocusedCol ) return;
	   if ( GradebookUtil.isIE() ) {
	   	 setTimeout(this.doRestoreFocus.bind(this), 0 );
	   }
	   else
	   {
	     this.doRestoreFocus();
	   }
	},
	
	doRestoreFocus: function() {
	   var lastFocusedRow = Gradebook.getModel().lastFocusedRow;
	   var lastFocusedCol = Gradebook.getModel().lastFocusedCol;
	   this.table.rows[lastFocusedRow].cells[lastFocusedCol].controller.selectCell();
	   Gradebook.getModel().lastFocusedRow = null;
	   Gradebook.getModel().lastFocusedCell = null;
	}
	
};

//Gradebook.GridViewPort --------------------------------------------------
Gradebook.GridViewPort = Class.create();

Gradebook.GridViewPort.prototype = {

	initialize: function(table, model, options,grid) {
		this.isIE = GradebookUtil.isIE();
		this.isNS7 = GradebookUtil.isNS7();
		this.table = table;
		this.model = model;
		this.options = options;
		this.grid = grid;
		this.lastPixelOffset = 0;
		this.colOffset = 0;
		this.lastRowPos = 0;
		this.startScrollLeft = 0;
		this.headerTableId = this.table.id + '_header';
		this.headerTable   = $(this.headerTableId);
		if (!this.headerTable) 
			this.headerTable = this.table;
		this.numVisibleRows = this.table.rows.length;
		this.numVisibleCols = this.headerTable.rows[0].cells.length-1; // don't include check column
		this.rowHeight = this.table.offsetHeight/this.numVisibleRows;
		this.div = this.table.parentNode;

		this.initScrollers();
	},

	unload: function() {
		this.grid = null;
		this.model = null;
		this.table = null;
		this.headerTable = null;
		this.div = null;
		this.scrollerDiv = null;
		this.heightDiv = null;
		this.scrollerDivH  = null;
		this.widthDiv = null;
		this.options = null;
	},
	
	modelChanged: function() {
		this.refreshContentsH();
	},
	
	getModelGridCell: function(row, col) {
		// in accessibleMode, row 0 is header, so we need to compensate to get model row
		if (this.options.accessibleMode && row > 0){
			row -= 1;
		}
		if (col > 0) col -= 1; // skip check col
		if (col >= this.options.numFrozenColumns) 
			col += this.colOffset; 
		var iterators = this.model.getRowIterators(row+this.lastRowPos, 1, col);
		if (!iterators || iterators.length != 1 || !iterators[0].hasNext()){
			GradebookUtil.error('getModelGridCell cannot get grid cell for row: '+ row+' col: '+col);
		}
		return iterators[0].next();
	},

	getHeaderGridCell: function(col) {
		if (col > 0) col -= 1; // skip check col
		if (col >= this.options.numFrozenColumns) 
			col += this.colOffset; 
		var iterator = this.model.getColDefIterator(col);
		if (!iterator || !iterator.hasNext()){
			GradebookUtil.error('getHeaderGridCell cannot get header cell for col: '+col);
		}
		return iterator.next();
	},

	getNumVisibleRows: function() {
		return this.numVisibleRows;
	},

	getNumVisibleCols: function() {
		return this.numVisibleCols;
	},

	populateRow: function(htmlRow, frozenColRowIterator, scrollableColRowIterator) {
		var numFrozenColumns = this.options.numFrozenColumns;
		for (var j=0; j < (this.numVisibleCols); j++) {
			var iterator = (j < numFrozenColumns)?frozenColRowIterator:scrollableColRowIterator;
			var gridCell = iterator.next();
			var htmlCell = htmlRow.cells[j+1];
			// set check box column based on isRowChecked flag for first grid cell
			if (j == 0){
				var checkInput = GradebookUtil.getChildElementByClassName(htmlRow.cells[0], 'input', 'checkInput');
				checkInput.checked = gridCell.isRowChecked();
			}
			htmlCell.controller.renderHTML(gridCell);
		}
	},
   
	refreshContents: function(rowOffset) {
		if (this.model.getNumRows() == 0) return;
		if (this.options.accessibleMode){
			this.refreshAccessibleContents();
			return;
		}
		Gradebook.CellController.prototype.hideAllSavingDivs();
		var numRows = this.numVisibleRows;
		var numModelRows = this.model.getNumRows();
		if (rowOffset + numRows > numModelRows)
			rowOffset = numModelRows - numRows - 1
		var numFrozenColumns = this.options.numFrozenColumns;
		var frozenColRowIterators = this.model.getRowIterators(rowOffset, numRows, 0);
		var scrollableColRowIterators = frozenColRowIterators;
		if (this.numVisibleCols > numFrozenColumns){
			scrollableColRowIterators = this.model.getRowIterators(rowOffset, numRows, numFrozenColumns+this.colOffset);
		}
		for (var i=0; i < numRows; i++) {
			this.populateRow(this.table.rows[i], frozenColRowIterators[i], scrollableColRowIterators[i]);
		}
		this.lastRowPos = rowOffset;
	},

	refreshAccessibleContents: function() {
		var numModelRows = this.model.getNumRows();
		var iters = this.model.getRowIterators();
		var numCols = this.table.rows[0].cells.length - 1; // skip check column
		var start = new Date().getTime();
		if (this.refreshRowCounter == undefined) this.refreshRowCounter = 0;
		for (var i = this.refreshRowCounter; i < numModelRows; i++) {
			var htmlRowIndex = i+1; // skip header row
			var htmlRow = this.table.rows[htmlRowIndex];
			// if we are rendering for more than 3 seconds, give Firefox some time to get
			// rid of the "unresponsive script" message.
			if(new Date().getTime() - start > 3000){
				setTimeout(this.refreshAccessibleContents.bind(this), 0 );
				return;
			}			
 			for (var j=0; j < numCols; j++) {
				var gridCell = iters[i].next();
				var htmlCell = htmlRow.cells[j+1]; // skip check column
				if (htmlCell.controller == undefined){
					new Gradebook.CellController(htmlCell, this.grid, htmlRowIndex, j+1);
				}
				htmlCell.controller.renderHTML(gridCell);
				// set check box column based on isRowChecked flag for first grid cell
				if (j == 0){
					var htmlCell = htmlRow.cells[0];
					if (htmlCell.controller == undefined){
						new Gradebook.CellController(htmlCell, this.grid, htmlRowIndex, j);
					}
					var checkInput = GradebookUtil.getChildElementByClassName(htmlCell, 'input', 'checkInput');
					checkInput.checked = gridCell.isRowChecked();
				}
			}
			this.refreshRowCounter++;
		}
		this.refreshRowCounter = null;
	},

   refreshContentsH: function() {
	// refresh data cells
	this.refreshContents(this.lastRowPos);

	// refresh the header cells
	var numFrozenColumns = this.options.numFrozenColumns;
	var hdrCells = null;
	var hdr = $(this.table.id+'_header');
	if (hdr) 
		hdrCells = hdr.rows[0].cells;
	else
		hdrCells = this.table.rows[0].cells;
	var frozenColIterator = this.model.getColDefIterator(0);
	var scrollableColIterator = null;
	if (this.numVisibleCols > numFrozenColumns){
		scrollableColIterator = this.model.getColDefIterator(numFrozenColumns+this.colOffset);
	}
	for (var i=0; i < this.numVisibleCols; i++) {
		var iterator = (i < numFrozenColumns)?frozenColIterator:scrollableColIterator;
		var htmlCell = hdrCells[i+1]; // skip check column
		var colDef = iterator.next();
		if (htmlCell.controller == undefined){
			new Gradebook.CellController(htmlCell, this.grid, 0, i+1);
		}
		htmlCell.controller.renderHeaderCellHTML( colDef );  
	}
	this.grid.updateSortImage();
   },

   visibleHeight: function() {
      return parseInt(GradebookUtil.getElementsComputedStyle(this.div, 'height'));
   },

	toViewIndex: function(modelSortIndex){
		var numFrozenColumns = this.options.numFrozenColumns;
		if (modelSortIndex < numFrozenColumns){
			return modelSortIndex;
		}
		var vi = (modelSortIndex - this.colOffset);
		if (numFrozenColumns <= vi && vi < this.numVisibleCols) 
			return vi;
		else
			return -1;
	},

	toModelIndex: function(viewSortIndex) {
		if (viewSortIndex == -1) 
			return -1;

		var numFrozenColumns = this.options.numFrozenColumns;
		var mi = (viewSortIndex < numFrozenColumns) ? viewSortIndex : (this.colOffset + viewSortIndex);
		return mi;
	},

   // scrolling management

   initScrollers: function() {
      this.createVScrollBar();
      this.createHScrollBar();
      this.lastVScrollPos = 0;
      if ( this.scrollerDivH != null ) 
	      this.lastHScrollPos = this.scrollerDivH.scrollLeft;
      else 
	      this.lastHScrollPos = 0;
      this.startScrollLeft = this.lastHScrollPos;
   },

   createVScrollBar: function() {
	if (this.table.rows.length >= this.model.getNumRows()){
		return;
	}
    var visibleHeight = this.visibleHeight();
    // create the outer div...
    this.scrollerDiv  = document.createElement("div");
    var scrollerStyle = this.scrollerDiv.style;
    scrollerStyle.borderRight = this.options.scrollerBorderRight;
    scrollerStyle.position    = "absolute";
    var tableWidth = this.isIE? this.table.offsetWidth-2+"px" : this.isNS7? this.table.offsetWidth-15+"px" : this.table.offsetWidth-3+"px";
	if ( document.documentElement.dir == 'rtl' ) 
    	scrollerStyle.right        = tableWidth;
    else 
    	scrollerStyle.left        = tableWidth;
    scrollerStyle.top        = "0px";
    scrollerStyle.width       = this.isNS7 ? "30px" : "19px";
    scrollerStyle.height      = visibleHeight + "px";
    scrollerStyle.overflow    = "auto";

    // create the inner div...
    this.heightDiv = document.createElement("div");
    this.heightDiv.style.width  = "1px";
	
	this.rowHeight = this.table.rows[this.table.rows.length-1].cells[1].offsetHeight;
	var divHeight = this.rowHeight * this.model.getNumRows();
	divHeight += ( this.numVisibleRows + 1 ); // looks like we are missing one pix per row, if not added we cannot scroll to the last item
	
    this.heightDiv.style.height = parseInt(divHeight) + "px" ;
    this.scrollerDiv.appendChild(this.heightDiv);
	Event.observe(this.scrollerDiv,'scroll',this.handleVScroll.bindAsEventListener(this));
	GradebookUtil.debug('createVScrollBar - this.rowHeight = '+this.rowHeight);
	GradebookUtil.debug('createVScrollBar - visibleHeight = '+visibleHeight);
	GradebookUtil.debug('createVScrollBar - numVisibleRows = '+this.numVisibleRows);
	GradebookUtil.debug('createVScrollBar - this.model.getNumRows() = '+this.model.getNumRows());
	GradebookUtil.debug('createVScrollBar - this.heightDiv.style.height = '+this.heightDiv.style.height);


	this.table.parentNode.parentNode.insertBefore( this.scrollerDiv, this.table.parentNode.nextSibling );
  	  var eventName = this.isIE ? "mousewheel" : "DOMMouseScroll";
	  Event.observe(this.table, eventName, 
	                function(evt) {
	                   if (evt.wheelDelta>=0 || evt.detail < 0) //wheel-up
	                      this.scrollerDiv.scrollTop -= (2*this.rowHeight);
	                   else
	                      this.scrollerDiv.scrollTop += (2*this.rowHeight);
	                   this.handleVScroll();
	                }.bindAsEventListener(this), 
	                false);
     },

   createHScrollBar: function() {
   	 // logic here is to create an div the same width that the non frozen columns
   	 // then put inside it an invisible inner div that would be the width of the non
   	 // frozen if they were all visible; by setting the parent with overflow: auto 
   	 // scroll bars will appear, and the scrolling events are captured to decide what
   	 // portion of the table should be displayed.
	   if (!this.headerTable.rows[0] || this.headerTable.rows[0].cells.length > this.model.getNumColDefs()) return;
	   var totalColumnCount = this.model.getNumColDefs();
	   var visibleColumnCount = this.numVisibleCols;
	   var numFrozenColumns = this.options.numFrozenColumns;
	   this.maxColOffset = totalColumnCount - (visibleColumnCount - numFrozenColumns) - 1;

	   var visibleHeight = this.isIE ? this.table.offsetHeight - 23 : this.isNS7 ? this.table.offsetHeight - 16 : this.table.offsetHeight - 3;
	   var checkColumnWidth = this.headerTable.rows[0].cells[0].offsetWidth;
     // set avg col width to be based on actual cell width (not including padding, etc.)
     // this will allow scrolling to be more accurate
     this.avgColWidth = this.headerTable.rows[0].cells[1].offsetWidth;
	   var frozenWidth = (numFrozenColumns * this.avgColWidth) + checkColumnWidth;
	   visibleWidth = ( visibleColumnCount - numFrozenColumns ) * this.avgColWidth;

	   // create the outer div...
	   this.scrollerDivH  = document.createElement("div");
	   var scrollerStyle = this.scrollerDivH.style;
	   scrollerStyle.position    = "absolute";
	   if ( document.documentElement.dir == 'rtl' ) 
		   scrollerStyle.right        =frozenWidth + "px";
	   else 
		   scrollerStyle.left        = frozenWidth + "px";

	   scrollerStyle.top        = visibleHeight + "px";
	   scrollerStyle.height       = this.isIE ? "40px" : this.isNS7 ? "30px" : "19px";
     scrollerStyle.width      = visibleWidth + "px";
     scrollerStyle.overflow    = "auto";

     // create the inner div...
     this.widthDiv = document.createElement("div");
     this.widthDiv.style.height  = "1px";
     this.widthDiv.style.direction = 'ltr';
     this.widthDiv.style.width = ( this.avgColWidth * ( totalColumnCount-numFrozenColumns ) ) + "px";
     this.scrollerDivH.appendChild(this.widthDiv);
     Event.observe(this.scrollerDivH,'scroll',this.handleHScroll.bindAsEventListener(this));

     if (this.scrollerDiv){
	     	this.table.parentNode.parentNode.insertBefore( this.scrollerDivH, this.scrollerDiv.nextSibling );
	   } else {
		    this.table.parentNode.parentNode.insertBefore( this.scrollerDivH, this.table.parentNode.nextSibling );
	   }
   },

   rowToPixel: function(rowOffset) {
      return (rowOffset / this.model.getNumRows()) * this.heightDiv.offsetHeight
   },
   
   moveScroll: function(rowOffset) {
	if (this.scrollerDiv){
	      this.scrollerDiv.scrollTop = this.rowToPixel(rowOffset);
	}
   },

	/* When scrolling, IE sends multiple onscroll events for a single scroll action by the user.
		To get around this, we set a timer and wait until the dust settles before doing the scroll
		Here is info on the work around: http://support.microsoft.com/kb/238004
	*/
	// scroll numRows, can be negative. returns false if scroll request is out of range
   scrollRows: function(numRows) {
	if (!this.scrollerDiv) return false;
	if ((numRows < 0 && this.scrollerDiv.scrollTop == 0) || 
		(numRows > 0 && this.lastRowPos == (this.model.getNumRows() - this.numVisibleRows))) {
		return false;
	}

	this.ignoreOnVscroll = true;
	this.scrollerDiv.scrollTop += (numRows * this.rowHeight);
      setTimeout(this.doVScroll.bind(this), 200 );
   },

   handleVScroll: function(evt) {
	if (this.ignoreOnVscroll) return;
	this.ignoreOnVscroll = true;
      setTimeout(this.doVScroll.bind(this), 200 );
   },

   doVScroll: function() {
	Gradebook.CellController.prototype.onGridScroll();
	var incomingscrollTop = this.scrollerDiv.scrollTop;
	var scrollDiff = this.lastVScrollPos-this.scrollerDiv.scrollTop;
	if (scrollDiff != 0.00) {
		var r = this.scrollerDiv.scrollTop % this.rowHeight;
		if (r != 0) {
			if (scrollDiff < 0 ) {
				this.scrollerDiv.scrollTop += (this.rowHeight-r);
			} else {
				this.scrollerDiv.scrollTop -= r;
			}
		}
		var contentOffset = parseInt(this.scrollerDiv.scrollTop / parseInt(this.rowHeight));
		GradebookUtil.debug('doVScroll - incomingscrollTop = '+incomingscrollTop+
				' r = '+r+
				' new scrollTop = '+this.scrollerDiv.scrollTop+
				' lastVScrollPos = '+this.lastVScrollPos+
				' contentOffset = '+contentOffset);
		this.refreshContents(contentOffset);
		this.lastVScrollPos = this.scrollerDiv.scrollTop;
	}
	this.ignoreOnVscroll = false;
   },

   handleHScroll: function(evt) {
	if (this.ignoreOnHscroll) return;
	this.ignoreOnHscroll = true;
      setTimeout(this.doHScroll.bind(this), 200 );
   },
	
	// scroll numCols, can be negative. returns false if scroll request is out of range
   scrollCols: function(numCols) {
	if (!this.scrollerDivH) return false;
	var totalColumnCount = this.model.getNumColDefs();

	if ((numCols < 0 && this.scrollerDivH.scrollLeft == 0) || 
		(numCols > 0 && this.colOffset == (this.model.getNumColDefs() - this.numVisibleCols))) {
		return false;
	}
	this.ignoreOnHscroll = true;
	this.scrollerDivH.scrollLeft += (numCols * this.avgColWidth);
      setTimeout(this.doHScroll.bind(this), 200 );
	return true;
   },

   doHScroll: function() {
	Gradebook.CellController.prototype.onGridScroll();
    var scrollDiff = this.lastHScrollPos - this.scrollerDivH.scrollLeft;
	if (scrollDiff != 0.00) {
	    // To align the column scroll 
		var r = this.scrollerDivH.scrollLeft % this.avgColWidth;
		if (r != 0) {
			if (scrollDiff < 0 ) {
				this.scrollerDivH.scrollLeft += (this.avgColWidth-r);
			} else {
				this.scrollerDivH.scrollLeft -= r;
			}
		}
		if ( document.documentElement.dir == 'rtl' )  {
			// Subtract the max scroll left with the current one and divide with the avgColWidth 
			this.colOffset = parseInt( (this.startScrollLeft - this.scrollerDivH.scrollLeft) / this.avgColWidth);
		} else {
			this.colOffset = parseInt(this.scrollerDivH.scrollLeft / this.avgColWidth);
		}
		this.colOffset = Math.min(this.colOffset,this.maxColOffset);
		this.refreshContentsH();
		this.lastHScrollPos = this.scrollerDivH.scrollLeft;
	}
	this.ignoreOnHscroll = false;
   }


};

	//*********************************************************************
	//************ Gradebook.CellController *******************************
	//*********************************************************************

Gradebook.CellController = Class.create();

Gradebook.CellController.prototype = {

	/* Controls all user interaction with an HTM table cell and its corresponding grid model cell including:
	
		cell-type specific context menus
		sorting by clicking on header cell
		selecting a table cell
		editing of cell value, which includes:
			going into edit mode - showing an input text values to be entered
			validating input as typed
			listening for certain keys to submit or cancel editing
			submitting changes to server and showing "Saving indicator"
		check box in first column for selecting students
		rendering of cell value and state indicators
		grade comment & column into popups

	*/
	initialize: function(htmlCell, grid, row, column) {
		this.htmlCell = htmlCell;
		htmlCell.id = row+','+column;
		htmlCell.controller = this;
		this.grid = grid;
		this.row = row;
		this.col = column;
		Gradebook.CellController.tableId = this.grid.table.id;
		this.isTopLeft = (this.row == 0 && this.col == 0);
		var accessibleMode = this.grid.options.accessibleMode;

		// get elements in cell
		if (!accessibleMode){
			this.viewDiv = GradebookUtil.getChildElementByClassName(htmlCell, 'div', 'gbView');
			this.editDiv = GradebookUtil.getChildElementByClassName(htmlCell, 'div', 'gbEdit');
			this.editInput = GradebookUtil.getChildElementByClassName(htmlCell, 'input', 'editInput');
		}
		this.textDiv = GradebookUtil.getChildElementByClassName(htmlCell, 'div', 'gbText');
		this.dataDiv = GradebookUtil.getChildElementByClassName(htmlCell, 'div', 'gbData');
		this.titleAnchor = GradebookUtil.getChildElementByClassName(htmlCell, 'a', 'titleAnchor');
		this.sortImage = GradebookUtil.getChildElementByClassName(htmlCell, 'img', 'sortImage');
		this.contextMenuAnchor = GradebookUtil.getChildElementByClassName(htmlCell, 'a', 'cmimg');
		this.checkInput = GradebookUtil.getChildElementByClassName(htmlCell, 'input', 'checkInput');

		var isAccessibleCheckHeader = accessibleMode && this.isTopLeft;
		
		// add listeners to cell & anchors
		if (!isAccessibleCheckHeader){
			Event.observe(this.htmlCell,'mouseover',this.onMouseOver.bindAsEventListener(this));
			Event.observe(this.htmlCell,'mouseout',this.onMouseOut.bindAsEventListener(this));
		} else {
			Event.observe(this.checkInput,'click',this.accessibleHeaderCheckInput.bindAsEventListener(this));
			return;
		}

		// add listeners to cell elements
		if (this.contextMenuAnchor){
			if (this.isTopLeft){
				Event.observe(this.contextMenuAnchor,'click',this.onCheckColumnContextMenuClicked.bindAsEventListener(this));
			} else {
				Event.observe(this.contextMenuAnchor,'click',this.onContextMenuClicked.bindAsEventListener(this));
			}
		}

		if (this.sortImage && column != 0){ // top header row has sort image
			this.getGridCell = this.getHeaderGridCell;
			Event.observe(this.textDiv,'click',this.onHeaderClicked.bindAsEventListener(this));
			this.htmlCell.style.cursor  = 'pointer';
		} else {
			this.getGridCell = this.getGradeGridCell;
		
			if (this.editInput){
				Event.observe(this.editInput,'keydown',this.onInputKeyDown.bindAsEventListener(this));
				Event.observe(this.editInput,'keyup',this.onInputKeyUp.bindAsEventListener(this));
			}			
            if (this.checkInput) {
				Event.observe(this.checkInput,'click',this.onCheckBoxClicked.bindAsEventListener(this));
			} else if (!this.isTopLeft) {
				Event.observe(this.htmlCell,'click',this.onClicked.bindAsEventListener(this));
			}
			if (accessibleMode && this.titleAnchor) Event.observe(this.titleAnchor,'focus',this.onClicked.bindAsEventListener(this));
		}
	},
		
	isHeaderCell: function()
	{
		return (this.row == 0);
	},

	unload: function() {
		this.grid = null;
		this.htmlCell.controller = null;
		this.htmlCell = null;
		this.grid = null;
		this.viewDiv = null;
		this.editDiv = null;
		this.editInput = null;
		this.textDiv = null;
		this.dataDiv = null;
		this.titleAnchor = null;
		this.sortImage = null;
		this.contextMenuAnchor = null;
		this.checkInput = null;
		this.getGridCell = null;
		this.editGridcell = null;
	},

	//************ checkbox logic *******************************

	onCheckBoxClicked: function(evt) {
		var gridcell = this.getGridCell();
		gridcell.setRowChecked(this.checkInput.checked);
		var userId = gridcell.userId;
		if(this.checkInput.checked){
			if (evt.shiftKey && Gradebook.CellController.prototype.lastCheckedUserId){
				this.grid.model.checkedRangeOfStudents(gridcell.userId,Gradebook.CellController.prototype.lastCheckedUserId);
			}
			Gradebook.CellController.prototype.lastCheckedUserId = gridcell.userId;
		} else {
			Gradebook.CellController.prototype.lastCheckedUserId = null;
		}
		
		this.updateNumSelectedIndicator();
	},

	accessibleHeaderCheckInput: function() {
		if(this.checkInput.checked){
			this.onSelectAllStudents();
		} else {
			this.onSelectNoStudents();
		}
	},

	onSelectAllStudents: function(evt) {
		this.grid.model.checkedAllStudents();
		this.updateNumSelectedIndicator();
	},

	onSelectNoStudents: function(evt) {
		this.grid.model.checkedNoStudents();
		this.updateNumSelectedIndicator();
	},
	
	onSelectInvertStudents: function(evt) {
		this.grid.model.invertCheckedStudents();
		this.updateNumSelectedIndicator();
	},
	
	onSortStudents: function(evt) {
		// always show checked students at top
		this.grid.sortColumn(this,'DESC');
	},
	
	updateNumSelectedIndicator: function() {
		var ids = this.grid.model.getCheckedStudentIds();
		$("rowindicator").update( ids.length );
	},
	
	
	//************ sort logic *******************************

	onHeaderClicked: function(evt) {
		this.grid.sortColumn(this);
	},

	setSortImage: function(dir) {
		var width = this.grid.options.sortImageWidth;
		var height = this.grid.options.sortImageHeight;
		var src = '';
		if ( dir == 'NO_SORT' ){
         	src = this.grid.options.sortBlankImg;
			width = 1;
			height = 1;
		} else if ( dir == 'ASC' ){
			src = this.grid.options.sortAscendImg;
		} else if ( dir == 'DESC' ){
			src = this.grid.options.sortDescendImg;
		}
		this.sortImage.src = src
		this.sortImage.width = width;
		this.sortImage.height = height;
	},

	//************ select cell logic *******************************

	onClicked: function(evt) {
      	var eventTarget = evt.target ? evt.target : evt.srcElement;
		Gradebook.CellController.prototype.lastEventTarget = eventTarget;
		this.selectCell();
   	},
   	
	isSelected: function() {
		return (Gradebook.CellController.currentSelectedCell == this.htmlCell);
	},
	
	selectCell: function() {
	    Gradebook.CellController.prototype.tableHasFocus = true;
		if (this.isSelected() || this.checkInput){
			return;
		}
		this.closePopups();
		this.unselectCurrentCell();
		GradebookUtil.debug('selectCell row = '+this.row+' col = '+this.col);
		var gridCell = this.getGridCell();
		Gradebook.CellController.currentSelectedCell = this.htmlCell;
		var hascm = this.hasContextMenu();
		Element.addClassName(this.htmlCell, hascm?"cellClick":"cellClickNoCM")
		Element.addClassName(this.htmlCell.parentNode, "focusRowHigh");
		var headerTable = $(Gradebook.CellController.tableId + '_header');
		if (headerTable){
			Element.addClassName(headerTable.rows[0].cells[this.col],"focusHeader");
		}	
		if (!this.isEditing && this.titleAnchor){
			this.titleAnchor.focus();
		} else if ( this.grid.options.accessibleMode ) {
		    this.htmlCell.focus();
		}
		this.setTaskbarInfo(gridCell);
		if (!this.grid.options.accessibleMode) this.startEdit();
	},

	setTaskbarInfo: function(gridCell) {
	    if (!gridCell) { 
	   		GradebookViewSpreadsheet.clearTaskBar();
	    } else if (gridCell.isGrade()) {
			var colDef = gridCell.colDef;
		    var gradeType = '&nbsp;'
		    var pointsPossible = '&nbsp;'
		    var primaryDisplay = '&nbsp;'
		    var visibileToStudents = '&nbsp;'
			try {
				if ( gridCell.canEdit() )
				{ 
					gradeType = GradebookUtil.getMessage((gridCell.isOverride())?'overrideGradeMsg':'gradeMsg');
				}
				else
				{ 
					switch (colDef.type){
						case "T": gradeType = 'totalMsg'; break;
						case "W": gradeType = 'weightedMsg'; break;
						case "A": gradeType = 'averageMsg'; break;
						case "M": gradeType = 'minMaxMsg'; break;
					}
					gradeType = GradebookUtil.getMessage(gradeType);
				}
	
				primaryDisplay = colDef.primarySchema.name;
				pointsPossible = NumberFormatter.getDisplayFloat( gridCell.getPointsPossible() );
				visibileToStudents = GradebookUtil.getMessage((colDef.vis)?'isMsg':'isNotMsg');
			} catch ( ignore ) { };
		    GradebookViewSpreadsheet.setTaskBar(gradeType,pointsPossible,primaryDisplay,visibileToStudents);
		} else {
		    GradebookViewSpreadsheet.setTaskBar();
		}
	},

	unselectCell: function() {
		GradebookUtil.debug('unselectCell row = '+this.row+' col = '+this.col);
		Element.removeClassName(this.htmlCell, "cellClick");
		Element.removeClassName(this.htmlCell, "cellClickNoCM");
		Element.removeClassName(this.htmlCell.parentNode, "focusRowHigh");
		var headerTable = $(Gradebook.CellController.tableId + '_header');
		if (headerTable){
			Element.removeClassName(headerTable.rows[0].cells[this.htmlCell.cellIndex],"focusHeader");
		}	
		this.setTaskbarInfo();
	},

	unselectCurrentCell: function() {
		var cell = Gradebook.CellController.currentSelectedCell;
		if (cell) {
			var commit = false;
			var cellController = cell.controller;
			if ( cellController) {
			  if ( cellController.hasUncommittedChanges()){
				  var validationError = cellController.editGridcell.validate(cellController.editInput.value);
				  if (!validationError){
					  commit = confirm(GradebookUtil.getMessage('uncommitedchangeErrorMsg'));
				  } else {
					  alert(GradebookUtil.getMessage('uncommitedchangeNotSavedErrorMsg'));
				  }
			  }
			cellController.stopEdit(commit);
			cellController.unselectCell();
	      }
		  Gradebook.CellController.currentSelectedCell = null;
		}
	},

	//************ edit grade logic *******************************
	
	startEdit: function(){
		try {
			this.editGridcell = this.getGridCell();
			if (!this.editGridcell.canEdit() || !this.isSelected() || !this.editInput) return;
			GradebookUtil.debug('startEdit row = '+this.row+' col = '+this.col);
			this.isEditing = true;
			this.editInput.value = this.editGridcell.getEditValue();
			this.viewDiv.style.display = "none";
			this.editDiv.style.display = "block";
			this.editInput.focus();
			this.editInput.select();
		} catch ( ignore ) { }
	},

	onInputKeyDown: function(evt){
		GradebookUtil.debug('onInputKeyDown row = '+this.row+' col = '+this.col+' keyCode = '+evt.keyCode);
		switch (evt.keyCode) {
			case (Event.KEY_TAB):
				this.stopEdit(true, true); //commit, doNotSetFocus
				evt.cancelBubble = true;
				break;
		}
	},
	
	onInputKeyUp: function(evt){
		evt.cancelBubble = true;
		GradebookUtil.debug('onInputKeyUp row = '+this.row+' col = '+this.col+' keyCode = '+evt.keyCode);
		switch (evt.keyCode) {
			case (Event.KEY_UP):
			case (Event.KEY_DOWN):
			case (Event.KEY_LEFT):
			case (Event.KEY_RIGHT):
				evt.cancelBubble = false; // allow event to bubble so attempted navigation will occur
				break;
			case (Event.KEY_RETURN):
				if (this.hasUncommittedChanges() && this.stopEdit(true)){ //commit
					// select cell below
					this.grid.selectRelativeCell(1, 0);
				}
				break;
			case (Event.KEY_ESC):		
				this.stopEdit(false); // don't commit
				break;
			default:
				var validationError = this.editGridcell.validate( this.editInput.value, true ); // match partial
				if (validationError){
					this.showValidationError(validationError);
				} else {
					this.hideValidationError();
				}
		}
	},	

	// returns false if validation error occurs when commiting
	stopEdit: function(commit, doNotSetFocus){
		if (!this.isEditing){
			return;
		}
		GradebookUtil.debug('stopEdit row = '+this.row+' col = '+this.col+' commit = '+commit);
		if (commit && this.hasUncommittedChanges()){
			var inputVal = this.editInput.value;
			var validationError = this.editGridcell.validate( inputVal );
			if (validationError){
				this.showValidationError(validationError);
				this.editInput.select();
				this.editInput.focus();
				return false;
			}
			var save = true;
			if (inputVal == '') inputVal = '-';
			// confirm if OK to delete or null grade
			if (inputVal == '-'){
				if (this.editGridcell.v == '-'){
					save = false;
				} else {
					var msg = (this.editGridcell.isOverride()?'confirmRevertMsg':'confirmNullMsg');
					save = confirm(GradebookUtil.getMessage(msg));
				}
			}
			if (save){
				// send update to server
				this.editGridcell.update(inputVal);
				
				// show saving message
				this.addSavingDiv();			
			}
		}
		this.hideValidationError();
		this.isEditing = false;
		this.editGridcell = null;
		this.viewDiv.style.display = "block";
		if (!doNotSetFocus){
			this.titleAnchor.focus();
		}
		this.editDiv.style.display = "none";
		return true;
	},

	hasUncommittedChanges: function(evt){
		return (this.isEditing && this.editInput.value != this.editGridcell.getEditValue());
	},	

	//************ rendering logic *******************************

	renderHTML: function(gridCell) {
		var anchorVal;
		var altVal;
		if (gridCell.savingDiv){
			this.showSavingDiv(gridCell.savingDiv);
           	gridCell.savingDiv.htmlCell = this.htmlCell;
		} else if (gridCell.isExempt()){
			anchorVal = gridImages.exemptGrade;
			altVal = gridCell.getAltValue();
		} else if (gridCell.needsGrading() && !gridCell.isOverride()){
			anchorVal = gridImages.needsGrading;
		} else if (gridCell.attemptInProgress() && !gridCell.isOverride()){
			anchorVal = gridImages.attemptInProgress;
		} else if (gridCell.isComplete()){
			anchorVal = gridCell.getCellValue();
			altVal = GradebookUtil.getMessage('completedMsg');
		} else if ( this.grid.options.accessibleMode && gridCell.isGrade() && !gridCell.isGraded() ) {
		    anchorVal = gridImages.noGrade;
		    altVal = gridCell.getAltValue();
		} else {
			anchorVal = gridCell.getCellValue();
			altVal = gridCell.getAltValue();
		}
		if (anchorVal != undefined){
			if (this.col == 1 && !gridCell.isAvailable()){
				anchorVal = gridImages.studentUnavailable+" "+anchorVal;
			}
			if (gridCell.isModified()){
			
				anchorVal = gridImages.gradeModified+" "+anchorVal;
			}
			if (anchorVal.blank()){
				anchorVal = '&nbsp;'
			}
			this.titleAnchor.innerHTML = anchorVal;
			this.titleAnchor.title = altVal;
		}
	},

	renderHeaderCellHTML: function( colDef ) {
		var anchorVal = '';
		var altVal;
		if (!colDef.isVisibleToStudents()){
			anchorVal += gridImages.itemNotVisible;
		}
		if (colDef.isPublic()){
			anchorVal += gridImages.externalGrade;
		}
		if (colDef.hasError()){
			anchorVal += gridImages.gradingError;
		}
		anchorVal += colDef.name;
		altVal = colDef.name;
		this.dataDiv.innerHTML = anchorVal;
		this.dataDiv.title = altVal;
	},
	
   
	addSavingDiv: function() {
		// create a "Saving" message by cloning the existing message
		var savingDiv = $("saveDiv").cloneNode(true);
		document.body.appendChild(savingDiv);
		
		// associate savingDiv with gridCell so saving message will scroll with gridCell
		var gridCell = this.editGridcell;
		if (!gridCell) gridCell = this.getGridCell();
       	gridCell.savingDiv = savingDiv;
       	savingDiv.gridCell = gridCell;
       	savingDiv.htmlCell = this.htmlCell;
       	
		// store savingDivs in a class-level array to allow hiding all savingDivs before scrolling refresh
		if (!Gradebook.CellController.prototype.savingDivs){
			Gradebook.CellController.prototype.savingDivs = new Array();
		}
		Gradebook.CellController.prototype.savingDivs.push(savingDiv);
		
		// show the savingDiv on top of htmlCell
		this.showSavingDiv(savingDiv);
		
		// show div for a period of time, then hide/remove it if grade change has been committed on server
		setTimeout(function(){
				var gc = savingDiv.gridCell;
				if (gc.isUncommitted){
					savingDiv.timerExpired = true;
				} else {
					savingDiv.style.display = 'none';
					savingDiv.parentNode.removeChild(savingDiv);
					gc.savingDiv = null;
					savingDiv.htmlCell.controller.renderHTML(gc);
				}
			},1000);
	},

	showSavingDiv: function(savingDiv){
	   	var pos = GradebookUtil._toAbsolute(this.htmlCell);
		savingDiv.style.top = pos.y;
	   	savingDiv.style.left = pos.x;
		savingDiv.style.minWidth = this.htmlCell.offsetWidth;
		savingDiv.style.minHeight = this.htmlCell.offsetHeight;
	   	savingDiv.style.display = "block";
	},

	hideAllSavingDivs: function(){
		var savingDivs = Gradebook.CellController.prototype.savingDivs;
		if (!savingDivs) return;
		for (var i = savingDivs.length-1; i >= 0; i--){
			if (!savingDivs[i].parentNode){
				// remove div if no longer in document
				savingDivs.splice(i,1); 
			} else {
				savingDivs[i].style.display = 'none';
			}
		}
	},
	
	removeAllSavingDivs: function(){
		var savingDivs = Gradebook.CellController.prototype.savingDivs;
		if (!savingDivs) return;
		for (var i = savingDivs.length-1; i >= 0; i--){
			var savingDiv = savingDivs[i];
	       	if (savingDiv.gridCell)
	       	{
	       		savingDiv.gridCell.savingDiv = null;
	       		savingDiv.gridCell = null;
	       		savingDiv.htmlCell = null;
	       	}
			if (!savingDivs[i].parentNode){
				// remove div if no longer in document
				savingDivs.splice(i,1); 
			} else {
				savingDivs[i].style.display = 'none';
			}
		}
	},
	
	showValidationError: function(error) {
		var errDiv = $("errorDiv");
		var p = GradebookUtil.getChildElementByClassName(errDiv, 'p', 'errorDiv2');
		p.update(error);
		var pos = GradebookUtil._toAbsolute(this.htmlCell);
		errDiv.style.top = pos.y+this.htmlCell.offsetHeight;
		errDiv.style.left = pos.x-1;
		errDiv.style.display = "block";
		Element.addClassName(this.htmlCell, "cellError");
	},
	
	hideValidationError: function() {
		var errDiv = $("errorDiv");
		errDiv.style.display = "none";
		Element.removeClassName(this.htmlCell, "cellError");
	},
	
	hasContextMenu: function() {
		if ( this.isTopLeft ){
			return true;
		} else {
			return (this.getGridCell().getContextMenuInfo(this) != null);
		}
	},
	
	onMouseOver: function(evt) {
		if (!this.htmlCell || this.htmlCell.className == "cellClick") return;
		var hascm = this.hasContextMenu();
		Element.addClassName(this.htmlCell, hascm?"cellhigh":"cellhighNoCM")
		var rowElement = this.htmlCell.parentNode;
		if (rowElement.className != "focusRowHigh"){
			Element.addClassName(rowElement, "rowhigh");
		}
	},   
	
	onMouseOut: function(evt) {
		if (!this.htmlCell || this.htmlCell.className == "cellClick") return;
		Element.removeClassName(this.htmlCell, "cellhigh")
		Element.removeClassName(this.htmlCell, "cellhighNoCM")
		var rowElement = this.htmlCell.parentNode;
		if (rowElement.className != "focusRowHigh"){
			Element.removeClassName(rowElement, "rowhigh");
		}
	},   

	//************ context menu logic *******************************

	onContextMenuClicked: function(evt) {
		GradebookUtil.debug('onContextMenuClicked');
		evt.cancelBubble = true;
		Gradebook.CellController.prototype.closePopups(evt);
		var gridCell = this.getGridCell();
		var menuInfo = gridCell.getContextMenuInfo(this);
		if (menuInfo) {
			this.setContextMenuInfo(menuInfo);
		}
	},

	onCloseContextMenu: function(evt) {
		evt.cancelBubble = true;
		if ( GradebookUtil.isIE() ){
		    if (!this.isHeaderCell()) 
		    {
				this.htmlCell.focus();
				this.selectCell();
			}
		} else {
			this.contextMenuAnchor.focus();
		}
		$(this.contextMenuId).style.left = "-5000";
		$(this.contextMenuId).style.top = "-5000";
	    $("shimDiv").style.display="none";
	},
	
	setContextMenuInfo: function(menuInfo) {
		this.contextMenuId = menuInfo.id;
		var menuDiv = $(this.contextMenuId);
		var firstItem = null;
		var lastItem = null;
		menuInfo.items.push({id: 'close_'+menuInfo.id, visible:true,
					onclick: this.onCloseContextMenu.bindAsEventListener(this)});
		menuInfo.items.each(function(mi) {
			$(mi.id).parentNode.style.display = (mi.visible)?"block":"none";
			// remove previous click handler, if any
			if ($(mi.id).onclickHandler){
				Event.stopObserving(mi.id, 'click', $(mi.id).onclickHandler);
				$(mi.id).onclickHandler = null;
			}
			if (mi.onclick){
				// add click handler for menu item and save for later removal
				var onclick = mi.onclick;
				if ( mi.receipt )
				{
				  onclick = function()
				  {
				    mi.onclick();
				    GradebookUtil.showInlineReceipt( gradebook2Messages[mi.receipt] );
				  }
				}
				$(mi.id).onclickHandler = onclick;
				Event.observe(mi.id, 'click', onclick);
			}
			if (!firstItem) firstItem = $(mi.id);
			lastItem = $(mi.id);
		});
		// TAB looping logic so that focus does not leave menu
		if ( lastItem.previousTABListener ) Event.stopObserving( lastItem.id, 'keypress', lastItem.previousTABListener );
		var tabListener = GradebookUtil.getOnTABFocusOnCallback( firstItem.id, false /*no shift*/);
		lastItem.previousTABListener = tabListener;
		Event.observe( lastItem.id, 'keypress', tabListener );
		if ( firstItem.previousTABListener ) Event.stopObserving( firstItem.id, 'keypress', lastItem.previousTABListener );
		var shiftTabListener = GradebookUtil.getOnTABFocusOnCallback( lastItem.id, true /*shift*/ );
		firstItem.previousTABListener = shiftTabListener;
		Event.observe( firstItem.id, 'keypress', shiftTabListener );
		// position and show menu
		var pos = GradebookUtil._toAbsolute(this.htmlCell);
		var ie = GradebookUtil.isIE();
        var rightedge = ie ? document.body.clientWidth: window.innerWidth;
        var bottomedge = ie ? document.body.clientHeight: window.innerHeight;
        if(pos.y+menuDiv.offsetHeight+30>bottomedge && pos.y-menuDiv.offsetHeight>0)pos.y=pos.y-menuDiv.offsetHeight-this.htmlCell.offsetHeight;
        if(pos.x+menuDiv.offsetWidth>rightedge-20)pos.x=pos.x-32;
		menuDiv.style.top = this.htmlCell.offsetHeight+pos.y+"px";
		menuDiv.style.left = pos.x+"px";
		menuDiv.style.display = "block";
		if ( GradebookUtil.isFFonMac() ) GradebookUtil.shimDiv( menuDiv );
		firstItem.focus();
	},
    
	onCheckColumnContextMenuClicked: function(evt) {
		evt.cancelBubble = true;
		Gradebook.CellController.prototype.closePopups(evt);
		var menuInfo = {
			id: "studentCheckHeaderCM",
			items: [
				{id: "sch_sort", visible:true,
					onclick: this.onSortStudents.bindAsEventListener(this)},
				{id: "sch_selectAll", visible:true,
					onclick: this.onSelectAllStudents.bindAsEventListener(this)},
				{id: "sch_selectNone", visible:true,
					onclick: this.onSelectNoStudents.bindAsEventListener(this)},
				{id: "sch_selectInvert", visible:true,
					onclick: this.onSelectInvertStudents.bindAsEventListener(this)}
				]};
		this.setContextMenuInfo(menuInfo);
	},
	
	//************ comments logic *******************************

	addGradeComment: function(evt,colDef) {
  		evt.cancelBubble = true; // swallow event
  		this.closePopups();
		var pos = GradebookUtil._toAbsolute(this.htmlCell);
		var submitCommentsButton = $("submitCommentsButton");
		if (submitCommentsButton.onclickHandler){
			Event.stopObserving(submitCommentsButton, 'click', submitCommentsButton.onclickHandler);
		}
		submitCommentsButton.onclickHandler = this.onSubmitComments.bindAsEventListener(this);
		Event.observe(submitCommentsButton,'click',submitCommentsButton.onclickHandler);
		var commentsDiv = $("commentsDiv");
		if (commentsDiv.onclickHandler){
			Event.stopObserving(commentsDiv, 'click', commentsDiv.onclickHandler);
		}
		commentsDiv.onclickHandler = this.onClickCommentsDiv.bindAsEventListener(this);
		Event.observe(commentsDiv,'click',commentsDiv.onclickHandler);
		var ie = GradebookUtil.isIE();
        var rightedge = ie ? document.body.clientWidth: window.innerWidth;
        var bottomedge = ie ? document.body.clientHeight: window.innerHeight;
        var offright=false;
		var offbottom=false;
		var offtop=false;
        if(pos.y+commentsDiv.offsetHeight>bottomedge)offbottom=true;
        if(pos.y-commentsDiv.offsetHeight<0)offtop=true;
        if(pos.x+commentsDiv.offsetWidth>rightedge-20)offright=true;
        if(offbottom && !offtop){
          $("commentArrowUp").style.display="none";
          $("commentArrowDown").style.display="block";
          $("commentArrowDown").className="bubArrowBot";
          $("commentArrowDownImg").src=this.grid.options.botArrowLImg;
	      pos.y=pos.y-commentsDiv.offsetHeight;
        }else{
          $("commentArrowUp").style.display="block";
          $("commentArrowDown").style.display="none";
          $("commentArrowUp").className="bubArrowTop";
          $("commentArrowUpImg").src=this.grid.options.topArrowLImg;
		}
        if(offright){
          $("commentArrowDown").className="bubArrowBot2";
          $("commentArrowUp").className="bubArrowTop2";
          $("commentArrowUpImg").src=this.grid.options.topArrowRImg;
          $("commentArrowDownImg").src=this.grid.options.botArrowRImg;
          pos.x=pos.x-200;
        }
		commentsDiv.style.top = this.htmlCell.offsetHeight+pos.y-10+"px";
		commentsDiv.style.left = pos.x+"px";
		commentsDiv.style.display = "block";
		if ( GradebookUtil.isFFonMac() ) GradebookUtil.shimDiv( commentsDiv );
	},

	onSubmitComments: function() {
		this.getGridCell().setComments($("studentComments").value, $("instructorComments").value);
		this.addSavingDiv();
		this.closeComments();
	},

	onClickCommentsDiv: function(evt) {
      	var eventTarget = evt.target ? evt.target : evt.srcElement;
		Gradebook.CellController.prototype.lastCommentsEventTarget = eventTarget;
	},

	testCommentsOpen: function(evt) {
		if (!evt) return;
		var ctrl = Gradebook.CellController.prototype;
		var eventTarget = evt.target ? evt.target : evt.srcElement;
		// if editing comments prompt user to save if click outside comments div
		if (parseInt($("commentsDiv").style.left) > 0 && 
			ctrl.lastCommentsEventTarget != eventTarget) {
			if (confirm(GradebookUtil.getMessage('uncommitedCommentChangeErrorMsg'))){
				$("submitCommentsButton").onclick();
			} else {
				ctrl.closeComments();
			}
		}
	},

	closeComments: function() {
		$("commentsDiv").style.left = "-5000px";
		$("commentsDiv").style.top = "-5000px";
		GradebookViewSpreadsheet.instructorCommentsResize._reset();
		GradebookViewSpreadsheet.studentCommentsResize._reset();
		var submitCommentsButton = $("submitCommentsButton");
		if (submitCommentsButton.onclickHandler){
			Event.stopObserving(submitCommentsButton, 'click', submitCommentsButton.onclickHandler);
			submitCommentsButton.onclickHandler = null;
		}
		var commentsDiv = $("commentsDiv");
		if (commentsDiv.onclickHandler){
			Event.stopObserving(commentsDiv, 'click', commentsDiv.onclickHandler);
			commentsDiv.onclickHandler = null;
		}
		$("shimDiv").style.display="none";
	},

	//************ miscellaneous *******************************

	closePopups: function(evt) {
		$("gradeHeaderCM").style.left = "-5000";
		$("gradeHeaderCM").style.top = "-5000";
		$("studentInfoHeaderCM").style.left = "-5000";
		$("studentInfoHeaderCM").style.top = "-5000";
		$("gradeCM").style.left = "-5000";
		$("gradeCM").style.top = "-5000";
		$("studentCheckHeaderCM").style.left = "-5000";
		$("studentCheckHeaderCM").style.top = "-5000";
		$("studentInfoCM").style.left = "-5000";
		$("studentInfoCM").style.top = "-5000";
		$("infodiv").style.left = "-5000";
		$("infodiv").style.top = "-5000";
		$("icondiv").style.left = "-3000px";
		$("icondiv").style.top = "-3000px";
		$("shadow").style.display = "none";
		Gradebook.CellController.prototype.testCommentsOpen(evt);
		$("shimDiv").style.display="none";
	},
	
	getGradeGridCell: function(){
		return this.grid.viewPort.getModelGridCell(this.row, this.col);
	},
	
	getHeaderGridCell: function(){
		return this.grid.viewPort.getHeaderGridCell(this.col);
	},
	
	documentClicked: function(evt) {
		var ctrl = Gradebook.CellController.prototype;
		ctrl.closePopups(evt);
		var eventTarget = evt.target ? evt.target : evt.srcElement;
		if (ctrl.lastEventTarget == eventTarget){
			ctrl.tableHasFocus = true;
		}
		else if (ctrl.tableHasFocus) {
			ctrl.unselectCurrentCell();
			ctrl.tableHasFocus = false;
		}
	},

	showDatePicker: function(evt,colDef) {
  		evt.cancelBubble = true; // swallow event
  		this.closePopups(evt);
		Event.observe('clearAttemptsDateButton','click',this.onSubmitClearAttemptsByDate.bindAsEventListener(this));
		var pos = GradebookUtil._toAbsolute(this.htmlCell);
		var datediv = $('datediv');
		datediv.style.top = this.htmlCell.offsetHeight+pos.y+"px";
		datediv.style.left = pos.x+"px";
		datediv.style.display = "block";
	},

	onSubmitClearAttemptsByDate: function() {
	  	var startDate = document.clearAttemptsDateForm.startDateField.value;
	  	var endDate = document.clearAttemptsDateForm.endDateField.value;
	  	var format = "yyyy-MM-dd HH:mm:ss";
		if ( getDateFromFormat( startDate, format ) > getDateFromFormat( endDate, format ) )
		{	
			alert( JS_RESOURCES.getString('validation.date_past') );
			return;
		}
		this.getGridCell().clearAttemptsByDate(startDate, endDate);
		$('datediv').hide();
	},

	viewColumnInfo: function(evt,colDef) {
  		evt.cancelBubble = true; // swallow event
  		this.closePopups(evt);
		var info = colDef.getInfo();
		info.each(function(ii) {
			$(ii.id).innerHTML = " "+ii.value;
		});
		var pos = GradebookUtil._toAbsolute(this.htmlCell);
		var infoDiv = $('infodiv');
		var ie = GradebookUtil.isIE();
        var rightedge = ie ? document.body.clientWidth: window.innerWidth;
        if(pos.x+infoDiv.offsetWidth>rightedge-20){
		  pos.x=pos.x-infoDiv.offsetWidth+50;
          $("bubbleArrowTop").className="bubArrowTop2";
          $("bubbleArrowTopImg").src=this.grid.options.topArrowRImg;
		}else{
          $("bubbleArrowTop").className="bubArrowTop";
          $("bubbleArrowTopImg").src=this.grid.options.topArrowLImg;
		}
		infoDiv.style.top = this.htmlCell.offsetHeight+pos.y-10+"px";
		infoDiv.style.left = pos.x+"px";
		infoDiv.style.display = "block";
		if ( GradebookUtil.isFFonMac() ) GradebookUtil.shimDiv( infoDiv );
	},

	sendEmail: function(type,studentIds){
		var sendEmailFunc = this.grid.options.sendEmailFunc;
		if (sendEmailFunc)
		{
			sendEmailFunc(type,studentIds);
		}
	},

	onGridScroll: function(){
		this.closePopups();
		this.unselectCurrentCell();
	}

};	


var GradebookUtil = {

   isValidFloat: function ( n ) {
   		var n = ''+n;
		var trimmedVal = n.strip();
		if (trimmedVal.endsWith(LOCALE_SETTINGS.getString('number_format.decimal_point'))) trimmedVal += '0';
		var numFormat = '^[-]?[0-9]*(\\.[0-9]+)?$';
		var re = new RegExp( numFormat );	
    	var isValidNum = trimmedVal.search( re ) == 0;
		return isValidNum;
   },
   
   showInlineReceipt: function( message ) {
        $("inlineReceiptMsg").update( message );
        $("hideInlineReceiptDiv").removeClassName( "hideme" );
   },
   
   formatStudentName: function ( student ) {
		var nameTemplate = new Template(GradebookUtil.getMessage('userNameTemplate'));
		var nameData = {first:student.first, last:student.last, user:student.user};
		return nameTemplate.evaluate(nameData);
   },
   
   isIE: function () {
      return navigator.userAgent.toLowerCase().indexOf("msie") >= 0;
   },

   isNS7: function () {
      return navigator.userAgent.toLowerCase().indexOf("netscape/7") >= 0;
   },
   
   isFFonMac: function() {
      return GradebookUtil.isMac() && GradebookUtil.isFirefox();
   },
   
   isFirefox: function() {
     return (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
   },
   
   isMac: function() {
     return (navigator.userAgent.toLowerCase().indexOf("mac") != -1);
   },
   
   trimId: function( primaryKey )
   {
     if ( primaryKey.charAt(0) != '_' ) return primaryKey;
     return primaryKey.slice(1, primaryKey.lastIndexOf('_') );
   },

   getMessage: function (key) {
      if ( Gradebook.getModel() ){
      	return Gradebook.getModel().getMessage(key);
      } else {
      	return key;
      }
   },

   getElementsComputedStyle: function ( htmlElement, cssProperty, mozillaEquivalentCSS) {
      if ( arguments.length == 2 )
         mozillaEquivalentCSS = cssProperty;

      var el = $(htmlElement);
      if ( el.currentStyle )
         return el.currentStyle[cssProperty];
      else
         return document.defaultView.getComputedStyle(el, null).getPropertyValue(mozillaEquivalentCSS);
   },

   toViewportPosition: function(element) {
      return this._toAbsolute(element,true);
   },

   /**
    *  Compute the elements position in terms of the window viewport
    *  so that it can be compared to the position of the mouse (dnd)
    *  This is additions of all the offsetTop,offsetLeft values up the
    *  offsetParent hierarchy, ...taking into account any scrollTop,
    *  scrollLeft values along the way...
    *
    *  Note: initially there was 2 implementations, one for IE, one for others.
    *  Mozilla one seems to fit all though (tested XP: FF2,IE7, OSX: FF2, SAFARI)
    **/
   _toAbsolute: function(element,accountForDocScroll) {
      return this._toAbsoluteMozilla(element,accountForDocScroll);
   },

   /**
    *  Mozilla did not report all of the parents up the hierarchy via the
    *  offsetParent property that IE did.  So for the calculation of the
    *  offsets we use the offsetParent property, but for the calculation of
    *  the scrollTop/scrollLeft adjustments we navigate up via the parentNode
    *  property instead so as to get the scroll offsets...
    *
    **/
   _toAbsoluteMozilla: function(element,accountForDocScroll) {
      var x = 0;
      var y = 0;
      var parent = element;
      while ( parent ) {
         x += parent.offsetLeft;
         y += parent.offsetTop;
         parent = parent.offsetParent;
      }

      parent = element;
      while ( parent &&
              parent != document.body &&
              parent != document.documentElement ) {
         if ( parent.scrollLeft  )
            x -= parent.scrollLeft;
         if ( parent.scrollTop )
            y -= parent.scrollTop;
         parent = parent.parentNode;
      }

      if ( accountForDocScroll ) {
         x -= this.docScrollLeft();
         y -= this.docScrollTop();
      }

      return { x:x, y:y };
   },

   docScrollLeft: function() {
      if ( window.pageXOffset )
         return window.pageXOffset;
      else if ( document.documentElement && document.documentElement.scrollLeft )
         return document.documentElement.scrollLeft;
      else if ( document.body )
         return document.body.scrollLeft;
      else
         return 0;
   },

   docScrollTop: function() {
      if ( window.pageYOffset )
         return window.pageYOffset;
      else if ( document.documentElement && document.documentElement.scrollTop )
         return document.documentElement.scrollTop;
      else if ( document.body )
         return document.body.scrollTop;
      else
         return 0;
   },

   getChildElementByClassName: function(parent, childTag, childClassName){
	var children = parent.getElementsByTagName(childTag);
	if (!children || children.length == 0) return null;
	for (var i = 0; i < children.length; i++){
		if (children[i].className.indexOf(childClassName) >= 0){
			return children[i];
		}
	}
	return null;
   },
	
   setChildElementTextByClassName: function(parent, childTag, childClassName, text){
	var child = GradebookUtil.getChildElementByClassName(parent, childTag, childClassName);
	if (child == null) return;
	child.innerHTML = text;
   },
	
	getLogger: function() {
	  	if (window.gbModel) return gbModel.getLogger(); // in case current scope owns gbModel
      	if (parent.gbModel) return parent.gbModel.getLogger();
	},

	debug: function(s) {
		var logger = this.getLogger();
		if (logger) {
			logger.debug(s);
		}
	},

	error: function(s) {
		var logger = this.getLogger();
		if (logger) {
			logger.error(s);
		}
	},
	
	//on firefox/mac scroll bars will show ontop of anything if not shimmed
    shimDiv: function( menuDiv ) {
        var shimIFrame =  $('shimDiv');
        if (!shimIFrame) return;
        shimIFrame.style.width = menuDiv.offsetWidth;
        shimIFrame.style.height = menuDiv.offsetHeight;
        var position = Position.page(menuDiv);
        shimIFrame.style.top = position[1];
        shimIFrame.style.left = position[0];
        shimIFrame.style.zIndex = 2;
        shimIFrame.style.display = "block";        
    },
    
    clearShim: function()
    {
        if ( $("shimDiv") ) $("shimDiv").style.display="none";
    },
    
    getOnTABFocusOnCallback: function( id, shift )
    {
    var elementToFocus = id;
    var withShift = shift;
    return function( evt )
    {
    	var ek=evt.keyCode;
    	var eventTarget = evt.target ? evt.target : evt.srcElement;
    	if ( (ek == Event.KEY_TAB) && $( elementToFocus ) && ( withShift == evt.shiftKey ) )
    	{
    		Event.stop( evt );
    	  	$( elementToFocus ).focus();
			return false;
    	}
    }
}

};
