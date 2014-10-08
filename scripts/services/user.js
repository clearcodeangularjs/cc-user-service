/*

    Copyright (C) 2012-2013 by Clearcode <http://clearcode.cc>
    and associates (see AUTHORS).

    This file is part of cc-user-service.

    cc-user-service is free software: you can redistribute it and/or modify
    it under the terms of the Lesser GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    cc-user-service is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with cc-user-service.  If not, see <http://www.gnu.org/licenses/>.

*/
(function(){
    'use strict';

    var UserServ = function($rootScope, time){
        this._data = {};
        this.$rootScope = $rootScope;
        this._temporarySession = false;
        this._time = time;

        if(localStorage.user){
            this._data = JSON.parse(localStorage.user);
        }
    }


    UserServ.$inject = ['$rootScope', 'time'];

    UserServ.prototype.register = function(data){
        this._data = data;
        localStorage.setItem('user', JSON.stringify(data));
    }

    UserServ.prototype.registerTemporary = function(data){
        this._data = data;
        this._temporarySession = true;
    }

    UserServ.prototype.unregister = function(){
        this._data = {};
        if(!this._temporarySession){
            delete localStorage.user;
        }
    }

    UserServ.prototype._save = function(){
        if(this._temporarySession){
            return null;
        }

        localStorage.setItem('user', JSON.stringify(this._data));
    }

    UserServ.prototype.isRegistered = function(){
        return Boolean(_.size(this._data));
    }

    UserServ.prototype.read = function(field){
        if(!this.isRegistered()){
            this.$rootScope.$broadcast('loginRequired');
            return null;
        }
        return this._data[field];
    }

    UserServ.prototype.getEmail = function(){
        return this.read('email');
    }

    UserServ.prototype.getId = function(){
        return this.read('id');
    }

    UserServ.prototype.getDateRange = function(){
        var range = this.read('date_range');
        if(angular.isObject(range)){
            return range;
        }
        else {
            return this._time.getTimeRange(range);
        }
    }

    UserServ.prototype.getDateRangeId = function(){
        var range = this.read('date_range');
        if(angular.isObject(range)){
            return undefined;
        }
        else {
            return range;
        }
    }

    UserServ.prototype.getToken = function(){
        return this.read('token');
    }

    UserServ.prototype.setDateRange = function(range){
        if(!this.isRegistered()){
            this.$rootScope.$broadcast('loginRequired');
            return null;
        }
        this._data['date_range'] = range;
        this._save();
    }

    angular.module('cc.user.service').service('userServ', UserServ);
})();
