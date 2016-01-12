$(document).ready(function() {
    'use strict';

    if ( typeof Object.create !== 'function' ) {
    	Object.create = function( obj ) {
    		function F() {}
    		F.prototype = obj;
    		return new F();
    	};
    }

    (function($) {
        var Gallery = {
            init: function(options, elem) {
                var self = this;

                self.elem = elem;
                self.$elem = $(elem);
                self.columns = 0;

                self.options = $.extend({}, $.fn.gallery.defaults, options);
                self.validateOptions();
                self.setup();
            },



            setup: function() {
                var self = this, intvalId;

                self.lightbox();
                self.createImageContainer();
                self.createGalleryContainer();
                self.setColumnCount();
                self.setColumnSize();
                self.insertImagesInColumns();

                $(window).resize(function() {
                    var intval = function () {
                        self.createGalleryContainer();
                        self.setColumnCount();
                        self.setColumnSize();
                        self.insertImagesInColumns();
                    };
                    clearTimeout(intvalId);
                    intvalId = setTimeout(intval, self.options.response);
                });
            },



            /**
             * Make sure the options are correct
             *
             */
            validateOptions: function() {
                var self = this,
                    columns = ['lg', 'md', 'sm', 'xs', 'lgsize', 'mdsize', 'smsize'],
                    lightbox = ['class', 'method', 'showDuration', 'hideDuration', 'externalImageSource', 'controls', 'response', 'opacity'] ,
                    i = 0;

                if(self.options.response < 10) {
                    self.options.response = 10;
                }

                for(; i < columns.length; i++) {
                    if(!self.options.columns.hasOwnProperty(columns[i])) {
                        self.options.columns[columns[i]] = $.fn.gallery.defaults.columns[columns[i]];
                    }
                }

                for(; i < lightbox.length; i++) {
                    if(!self.options.lightbox.hasOwnProperty(lightbox[i])) {
                        self.options.lightbox[lightbox[i]] = $.fn.gallery.defaults.lightbox[lightbox[i]];
                    }
                }
            },



            /**
             * Makes the the images in the gallery work with a lightbox plugin
             * Given the gallery.defaults.lightbox.class and .lightbox.method
             */
            lightbox: function() {
                var self = this, options = self.options.lightbox;

                if(self.options.class !== '') {
                    self.$elem.find('img').each(function() {
                        $(this).addClass(self.options.class);
                    });

                    if(self.options.method !== '') {
                        $(document).on('click', '.zoom .img img.' + self.options.class, function() {
                            $(this)[self.options.method](options);
                        });
                    }
                }
            },



            /**
             * Creates a container that will hold references to all the images in the gallery.
             * To make sure that there won't be copies of images.
             */
            createImageContainer: function() {
                var self = this,
                    $imgContainer = $('<div class="img-container" style="display:none;"></div>').appendTo(self.$elem),
                    $images = self.$elem.find('img');

                //Add an data-id equal to the index of the image
                //and clone the image to the image container
                $images.each(function() {
                    var $img = $(this);
                    $img.attr('data-id', $img.index());
                    $img.clone().appendTo($imgContainer);
                });

                //Remove the original image
                $images.each(function() {
                    $(this).remove();
                });
            },



            /**
             * Creates a container for the gallery itself.
             */
            createGalleryContainer: function() {
                var self = this;

                //Remove g-container and it's content if it exists
                $('div.g-container').remove();

                //Create a new g-container
                $('<div class="g-container"></div>')
                    .appendTo(self.$elem);
            },



            /**
             * Sets the number of columns depending on the current width of the window
             * Gets the options for the number of columns from the gallery.defaults.columns object.
             */
            setColumnCount: function () {
                var self = this, widthOfWindow = $(window).width(), options = self.options.columns;
                if(widthOfWindow >= options.lgsize) {
                    self.columns = options.lg;
                } else if(widthOfWindow >= options.mdsize) {
                    self.columns = options.md;
                } else if(widthOfWindow >= options.smsize) {
                    self.columns = options.sm;
                } else if(widthOfWindow < options.smsize) {
                    self.columns = options.xs;
                }
            },



            /**
             * Creates columns given the number of columns from the function @setColumnCount
             */
            setColumnSize: function () {
                var self = this, i, index = 0;

                for(i = 0; i < self.columns; i++) {
                    if(index < self.columns) {
                        $('<div class="gallery-column"></div>').appendTo('.g-container');
                        index++;
                    }
                }

                $('.g-container div.gallery-column').each(function(ind) {
                    $(this).css({'width' : ((1 / self.columns) * 100) + '%'});
                });
            },



            /**
             * Inserts the images evenly over all of the columns.
             */
            insertImagesInColumns: function() {
                var self = this, classname = self.$elem.attr('class');

                $('.' + classname +' img').each(function() {
                    var imageId = $(this).data('id'), marginright = self.options.margin;

                    if(imageId % self.columns === self.columns - 1) {
                        marginright = 0;
                    }

                    $('<div class="zoom"></div>')
                        .appendTo($('.' + classname + ' .g-container div.gallery-column')
                            .eq(imageId % self.columns))
                        .append(
                            $('<div class="img"></div>').append($(this).clone())
                        )
                        .css({
                            'margin-bottom' : self.options.margin,
                            'margin-right': marginright,
                            'border': self.options.border,
                        });
                });
            },
        };

        $.fn.gallery = function(options) {
            return this.each(function() {
                var gallery = Object.create(Gallery);
                gallery.init(options, this);
            });
        };

        $.fn.gallery.defaults = {
            'columns': {
                'lg': 5,
                'md': 4,
                'sm': 3,
                'xs': 2,
                'lgsize': 1200,
                'mdsize': 992,
                'smsize': 768,
            },
            'margin': 2,
            'border': '',
            'response': 250,
            'class': 'lightbox',
            'method': 'lightbox',
            'lightbox': {
                'showDuration': 'fast',
                'hideDuration': 'slow',
                'externalImageSource': 'data-src',
                'controls': true,
                'response': 250,
                'opacity': 1,
            },
        };
    }) (jQuery);
});
