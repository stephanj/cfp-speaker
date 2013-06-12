'use strict';

genericServices.factory('Speakers',function ($http, $q, $filter, UserService) {
    var cached;
    var filter = function (list, partialTagName) {
        var ret = angular.copy(list);
        ret = $filter('filter')(ret, partialTagName.toLowerCase());
        ret = $filter('orderBy')(ret, function (o) {
            return o.name.toLowerCase();
        });
        ret = $filter('limitTo')(ret, 10);
        return ret;
    };
    return {
        query: function (partialTagName) {
            var defer = $q.defer();
            if (!cached) {
                var url = proposalUri + '/event/1/tag?size=1000&userToken=' + UserService.getToken();
                $http.get(url, {
                }).success(function (data, status, headers, config) {
                        cached = data.results;
                        defer.resolve(filter(cached, partialTagName));
                    }).error(function (data, status, headers, config) {
                        defer.reject('Error loading tags');
                    });
            } else {
                defer.resolve(filter(cached, partialTagName));
            }
            return defer.promise;
        }
    }
});
