Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
    	{
    		xtype: 'container',
    		itemId: 'pulldown-container',
    		layout: {
		        type: 'hbox',
		        align: 'stretch'
		    }
	    }
    ],
    defectStore: undefined,
    defectGrid: undefined,

    launch: function() {
    	
    	console.log("Interactive Grid App");
    	
    	this._loadIteration();
    },

    _loadIteration: function () {
    	var me = this;
    	var iterbox = {
    		xtype: 'rallyiterationcombobox',
    		itemId: 'iteration-combobox',
			fieldLabel: 'Select Iteration:',
			labelAlign: 'right',
			width: 300,
			listeners: {
				ready: me._onIterationReady,
				select: me._loadData,
				scope: me
			}	    
		};		

    	//this.pulldownContainer.add(this.iterbox);
    	this.down('#pulldown-container').add(iterbox);
    },

    _onIterationReady: function (combobox) {
    	this._loadSeverity();
    },

    _loadSeverity: function() {
    	var me = this;
    	var sevbox = {
    		xtype: 'rallyfieldvaluecombobox',
    		itemId: 'severity-combobox',
    		model: 'Defect',
    		field: 'Severity',
    		fieldLabel: 'Select Severity:',
    		labelAlign: 'right',
    		width: 300,
    		listeners: {
				ready: me._onSeverityReady,
				select: me._loadData,
				scope: me
			}
    	};

    	//this.pulldownContainer.add(this.sevbox);
    	this.down('#pulldown-container').add(sevbox);
    },

    _onSeverityReady: function (combobox) {
		this._loadPriority();
	},
	_loadPriority: function() {
		var me = this;
    	var priobox = {
    		xtype: 'rallyfieldvaluecombobox',
    		itemId: 'priority-combobox',
    		model: 'Defect',
    		field: 'Priority',
    		fieldLabel: 'Select Priority:',
    		labelAlign: 'right',
    		width: 300,
    		listeners: {
				ready: me._loadData,
				select: me._loadData,
				scope: me
			}
    	};

    	//this.pulldownContainer.add(this.priobox);
    	this.down('#pulldown-container').add(priobox);
    },

    _getFilters: function(iterval,sevval,prioval) {
    	var iterfilter = Ext.create('Rally.data.wsapi.Filter',{
    	    property: 'Iteration',
            operation: '=',
            value: iterval
        });

    	var sevfilter = Ext.create('Rally.data.wsapi.Filter',{
    	    property: 'Severity',
            operation: '=',
            value: sevval
        });

    	var priofilter = Ext.create('Rally.data.wsapi.Filter',{
    	    property: 'Priority',
            operation: '=',
            value: prioval
        });

    	return iterfilter.and(sevfilter.or(priofilter));
    },

    _loadData: function() {
    	var me = this;
    	var itersel = this.down('#iteration-combobox').getRecord().get('_ref');
    	var sevsel = this.down('#severity-combobox').getRecord().get('value');
    	var priosel = this.down('#priority-combobox').getRecord().get('value');

    	var myfilters = me._getFilters(itersel,sevsel,priosel);

    	if (me.defectStore) {

    		me.defectStore.setFilter(myfilters);
    		me.defectStore.load();

    	} else {

    		me.defectStore = Ext.create('Rally.data.wsapi.Store', {
			    model: 'Defect',
			    autoLoad: true,
			    filters: myfilters,
			    listeners: {
			        load: function(store, data, success) {
			            console.log("got data",store, data, success);
		            	if(!me.defectGrid) {
		            		me._createGrid(store);
		            	}
			        },
			        scope: me
			    },
			    fetch: ['FormattedID', 'Name', 'ScheduleState', 'Severity', 'Priority', 'Iteration']
			});
    	}
    	
    },

    _createGrid: function(myStoryStore) {
    	var me = this;
    	me.defectGrid = Ext.create('Rally.ui.grid.Grid', {
				store: myStoryStore,
				columnCfgs: [
					'FormattedID', 'Name', 'ScheduleState', 'Severity', 'Priority', 'Iteration'
				]	
			});

    	console.log("my grid", me.defectGrid);

    	me.add(me.defectGrid);
    }
});
