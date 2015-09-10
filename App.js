Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
    	
    	console.log("Interactive Grid App");
    	
    	this.pulldownContainer = Ext.create('Ext.container.Container',{
    		id: 'pulldownContainer-id',
    		layout: {
		        type: 'hbox',
		        align: 'stretch'
		    },
    	});

    	this.add(this.pulldownContainer);
    	this._loadIteration();
    },

    _loadIteration: function () {
    	this.iterbox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			fieldLabel: 'Select Iteration:',
			labelAlign: 'right',
			width: 300,
			listeners: {
				ready: function (combobox) {
					//this._loadData();
					this._loadSeverity();
				},
				select: function(combobox, records) {
					this._loadData();
				},
				scope: this
			}	    
		});		

    	this.pulldownContainer.add(this.iterbox);
    },

    _loadSeverity: function() {
    	this.sevbox = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
    		model: 'Defect',
    		field: 'Severity',
    		fieldLabel: 'Select Severity:',
    		labelAlign: 'right',
    		width: 300,
    		listeners: {
				ready: function (combobox) {
					this._loadPriority();
				},
				select: function(combobox, records) {
					this._loadData();
				},
				scope: this
			}
    	});

    	this.pulldownContainer.add(this.sevbox);
    },

	_loadPriority: function() {
    	this.priobox = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
    		model: 'Defect',
    		field: 'Priority',
    		fieldLabel: 'Select Priority:',
    		labelAlign: 'right',
    		width: 300,
    		listeners: {
				ready: function (combobox) {
					this._loadData();
				},
				select: function(combobox, records) {
					this._loadData();
				},
				scope: this
			}
    	});

    	this.pulldownContainer.add(this.priobox);
    },

    _loadData: function() {

    	var itersel = this.iterbox.getRecord().get('_ref');
    	var sevsel = this.sevbox.getRecord().get('value');
    	var priosel = this.priobox.getRecord().get('value');

    	var myfilter = [{
            property: 'Iteration',
            operation: '=',
            value: itersel
        },
        {
            property: 'Severity',
            operation: '=',
            value: sevsel
        },
        {
            property: 'Priority',
            operation: '=',
            value: priosel
        }];

    	if (this.DefectStore) {

    		this.DefectStore.setFilter(myfilter);
    		this.DefectStore.load();

    	} else {

    		this.DefectStore = Ext.create('Rally.data.wsapi.Store', {
			    model: 'Defect',
			    autoLoad: true,
			    filters: myfilter,
			    listeners: {
			        load: function(store, data, success) {
			            console.log("got data",store, data, success);
		            	if(!this.myGrid) {
		            		this._createGrid(store);
		            	}
			        },
			        scope: this
			    },
			    fetch: ['FormattedID', 'Name', 'ScheduleState', 'Severity', 'Priority', 'Iteration']
			});
    	}
    	
    },

    _createGrid: function(myStoryStore) {
    	
    	this.myGrid = Ext.create('Rally.ui.grid.Grid', {
				store: myStoryStore,
				columnCfgs: [
					'FormattedID', 'Name', 'ScheduleState', 'Severity', 'Priority', 'Iteration'
				]	
			});

    	console.log("my grid", this.myGrid);

    	this.add(this.myGrid);
    }
});
