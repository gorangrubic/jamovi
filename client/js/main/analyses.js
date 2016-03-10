
/* jshint evil: true, strict: true */

'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Promise = require('es6-promise').Promise;

var Analysis = function(id, name, ns) {

    this.id = id;
    this.name = name;
    this.ns = ns;
    
    this.def = null;

    var self = this;

    this.ready = new Promise(function(resolve, reject) {
        self._notifyReady = resolve;
        self._notifyFail  = reject;
    });

    var url = 's/analyses/' + this.ns + '/' + this.name;

    $.getScript(url, function(script) {

        self.def = script;
        self._notifyReady();

    }).fail(function(err) {

        self._notifyFail(err);
    });
};

var Analyses = Backbone.Model.extend({

    initialize : function() {
        this._analyses = [ ];
        this._nextId = 0;
    },
    defaults : {
        dataSetModel : null
    },
    createAnalysis : function(name, ns) {
        var id = this._nextId;
        var analysis = new Analysis(id, name, ns);
        this._analyses[id] = analysis;
        this._nextId += 1;

        this.trigger('analysisCreated', analysis);
    }
});

module.exports = Analyses;