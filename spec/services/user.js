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
'use strict'

describe('user service', function(){
    beforeEach(module('sandboxApp'));

    var user, $rootScope, $httpBackend, loginRequiredEventRaised, time;

    beforeEach(function(){
        module(function($provide){
            $provide.value('time', jasmine.createSpyObj('time', ['getTimeRange']));
        });
    });

    beforeEach(inject(function(_userServ_, _$rootScope_, _$httpBackend_, _time_){
        user = _userServ_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        time = _time_;
        time.getTimeRange.andReturn('time range');
        loginRequiredEventRaised = false;
        $rootScope.$on('loginRequired', function(){
            loginRequiredEventRaised = true;
        });
        delete localStorage.user;
        user.unregister();
    }));

    afterEach(function(){
        user.unregister();
    });

    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have not registered user on start', function(){
        expect(user.isRegistered()).toBe(false);
    });

    describe('when user registered', function(){
        var userData;
        beforeEach(function(){
            userData = {
                id: 111,
                email: 'test@test.com'
            }
            user.register(userData);
        });

        it('should register the user', function(){
            expect(JSON.parse(localStorage.user)).toEqual(userData);
        });

        it('should unregister the user', function(){
            user.unregister();
            expect(localStorage.user).toBe(undefined);
        });

        it('should inform that user is registered', function(){
            expect(user.isRegistered()).toBe(true);
        });

        it('should return user name', function(){
            expect(user.getEmail()).toEqual('test@test.com');
        });

        it('should return user id', function(){
            expect(user.getId()).toEqual(111);
        });
        
        describe('.getDateRange()', function(){
            describe('when saved date range is an string id', function(){
                beforeEach(function(){
                    user.setDateRange('last_7_days');
                });

                it('should return value from time.getTimeRange()', function(){
                    expect(user.getDateRange()).toEqual('time range');
                    expect(time.getTimeRange).toHaveBeenCalledWith('last_7_days');
                });
            });

            describe('when saved date range is an object with ranges', function(){
                var rangeObject;
                beforeEach(function(){
                    rangeObject = {
                        min: new Date(2014, 4, 10),
                        max: new Date(2014, 5, 10)
                    };

                    user.setDateRange(rangeObject);
                });

                it('should return range the object which was saved', function(){
                    expect(user.getDateRange()).toEqual(rangeObject)
                });
            });
        });
    });

    describe('when user not registered', function(){
        beforeEach(function(){
            user.unregister();
        });

        describe('when reading user data', function(){
            beforeEach(function(){
                user.getEmail();
            });

            it('should raise loginRequired event', function(){
                expect(loginRequiredEventRaised).toBe(true);
            });
        });
    });

    describe('.setDateRange()', function(){
        describe('when user is not registered', function(){
            beforeEach(function(){
                user.unregister();
                user.setDateRange();
            });

            it('should raise loginRequired event', function(){
                expect(loginRequiredEventRaised).toBe(true);
            });
        });

        describe('when user is registered', function(){
            beforeEach(function(){
                var userData = {
                    id: 111,
                    email: 'test@test.com'
                }
                user.register(userData);
            });

            it('should set date_range', function(){
                user.setDateRange('last_month');
                expect(user.getDateRange()).toEqual('time range');
                expect(time.getTimeRange).toHaveBeenCalledWith('last_month');
            });

            it('should not raise loginRequired event', function(){
                user.setDateRange('last_week');
                expect(loginRequiredEventRaised).toBe(false);
            });
        });
    });
});
