(function () {
    /**
     * Filters out the given tree
     *
     * @params {Object} $this
     **/
    function filterTree($this) {
        var val = $this.val().toLowerCase();
        var treeSelector = '#' + $this.attr('aria-controls');

        removeMarkupFromTree(treeSelector);
        if (val.length > 1) {
            searchInTree(treeSelector, val);
        }
    }

    /**
     * Toggle "expand" attribute groups
     *
     * @params {Object} $elem
     * @params {Boolean} expandValue
     **/
    function toggleExpandGroup($elem, expandValue) {
        if (!$elem) {
            return;
        }

        var $parent = $elem.parents('.treeitemgroup');
        $parent.attr('aria-expanded', expandValue);
        $parent.attr('aria-selected', expandValue);
    }

    /**
     * Search the given value within the tree found from the given selector
     *
     * @params {String} selector
     * @params {String} value
     **/
    function searchInTree(selector, value) {
        var $tree = jQuery(selector);
        if ($tree.length === 0) {
            return;
        }

        $tree.find('.subtreeitems .slds-tree__item .slds-tree__item-label').each(function () {
            var $this = jQuery(this);
            var text = $this.text().toLowerCase();

            // If not found, then hide it
            if (text.indexOf(value) === -1) {
                $this.parents('.treeitem').addClass('slds-hide');
                return;
            }

            // If found, then
            // 1. keep it visible
            // 2. highlight the word
            // 3. expand the related parents
            var html = $this.html();
            var htmlWithMarks = html.replace(new RegExp('(' + value + ')', 'gi'), '<mark>$1</mark>');
            $this.html(htmlWithMarks);

            toggleExpandGroup($this, true);
        });
    }

    /**
     * Removes the markup from the tree found from the given selector
     *
     * @params {String} selector
     **/
    function removeMarkupFromTree(selector) {
        var $tree = jQuery(selector);
        if ($tree.length === 0) {
            return;
        }

        $tree.find('.subtreeitems .slds-tree__item .slds-tree__item-label').each(function () {
            var $this = jQuery(this);
            var html = $this.html();
            var htmlWithoutMarks = html.replace(/<\/?mark>/gm, '');
            $this.html(htmlWithoutMarks);

            // Set the item visible back
            $this.parents('.treeitem').removeClass('slds-hide');
            // Remove the selected state
            toggleExpandGroup($this, false);
        });
    }

    /**
     * Initialize all events
     */
    function initialize() {
        // Initialize tree
        jQuery('body').on('click', '.slds-tree .treeitemgroup > .slds-tree__item', function () {
            var $this = jQuery(this);
            var $parent = $this.parents('.treeitemgroup');
            var ariaParentInactive = $parent.attr('aria-expanded') === 'false';
            toggleExpandGroup($this, ariaParentInactive);
        });

        // Initialize quick find in trees
        jQuery('body').on('blur', '.tree-filter', function () {
            filterTree(jQuery(this));
        });
        jQuery('body').on('keyup', '.tree-filter', function (e) {
            if (e.key === 'Enter') {
                filterTree(jQuery(this));
            }
        });

        jQuery('body').on('click', '.slds-vertical-tabs__nav-item', function (e) {
            e.preventDefault();
            var $this = jQuery(this);
            var target = $this.find('.slds-vertical-tabs__link').attr('aria-controls');
            if (target.length === 0) {
                return;
            }

            // Hide all ".slds-vertical-tabs__content"
            jQuery('.slds-vertical-tabs__content').removeClass('slds-show show active').addClass('slds-hide');
            // Show the target
            jQuery('#' + target).addClass('slds-show show active').removeClass('slds-hide');
            // Set all ".slds-vertical-tabs__nav-item" as disabled
            jQuery('.slds-vertical-tabs__nav-item').removeClass('slds-is-active');
            // Show the target link
            $this.addClass('slds-is-active');
        });
    }

    initialize();
}());
