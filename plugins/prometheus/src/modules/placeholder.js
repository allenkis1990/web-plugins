define ( ['angular'], function ( angular, undef ) {
    "use strict";
    var propName,
        needsShimByNodeName;
    propName            = 'placeholder';
    needsShimByNodeName = {};
    angular.module ( "Placeholder", [] )
        .directive ( "placeholder", [
            "$document",
            "$timeout",
            function ( $document, $timeout ) {
                angular.forEach ( ['INPUT', 'TEXTAREA'], function ( val ) {
                    needsShimByNodeName[val] = $document[0].createElement ( val )[propName] === undef;
                } );
                function isPasswordType( type ) {
                    return type && type.toLowerCase () === "password";
                }

                return {
                    require : "?^ngModel",
                    restrict: "A",
                    link    : function ( $scope, $element, $attributes, $controller ) {
                        var className, needsShim, text;
                        text      = $attributes[propName];
                        className = $attributes[propName + "Class"] || propName;
                        needsShim = needsShimByNodeName[$element[0].nodeName];

                        $element.bind ( "blur", function () {
                            var currentValue;
                            currentValue = $element.val ();

                            if ( !currentValue ) {
                                $element.addClass ( className );
                                if ( needsShim ) {
                                    $timeout ( function () {
                                        $element.val ( text );
                                    }, 1 );
                                }
                            }
                        } );
                        $element.bind ( "focus", function () {
                            if ( needsShim && $element.hasClass ( className ) ) {
                                $element.val ( "" );
                            }

                            $element.removeClass ( className );
                        } );

                        if ( needsShim ) {
                            $controller.$formatters.unshift ( function ( val ) {
                                if ( isPasswordType ( $element.prop ( "type" ) ) ) {
                                    return val;
                                }
                                if ( val ) {
                                    $element.removeClass ( className );

                                    return val;
                                }
                                $element.addClass ( className );
                                return text;
                            } );
                        }
                    }
                };
            }
        ] );
} );
