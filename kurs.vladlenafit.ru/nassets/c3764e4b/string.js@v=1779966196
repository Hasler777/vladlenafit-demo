jQuery.widget( 'gc.stringField', $.gc.abstractField, {

	build: function() {
		this.input = $('<input/>');
        if ( this.field.id ) {
            this.input.attr('id', 'field-input-' + this.field.id);
        }
		this.input.appendTo( this.inputBlock );
	},

	initEditor: function( settingsEl ) {
        $.gc.abstractField.prototype.initEditor.call(this, settingsEl );

		this.placeholderInput = this.makeInputField( 'placeholder', Yii.t( "common", "Hint" ) )
		this.sizeInput = this.makeInputField( 'size', Yii.t( "common", "Size of the field" ), 3 )

        if (this.field.is_utm) {
            this.hideUtmSettings();
            this.tryCreateUtmHint();
        }
	},

	getField: function() {
		var result = $.gc.abstractField.prototype.getField.call(this);
		if ( ! result.settings || ( Object.prototype.toString.call( result.settings ) === '[object Array]' ) ) {
			result.settings = {};
		}
		result.settings.placeholder = this.placeholderInput.val();
		if ( this.sizeInput ) {
			result.settings.size = this.sizeInput.val();
		}
		return result;
	},

	rebuild: function() {
		$.gc.abstractField.prototype.rebuild.call(this);
        this.input.attr( 'type', this.getInputType() )
        this.input.attr( 'placeholder', this.field.settings.placeholder )
		if ( this.field.settings.size ) {
			this.input.attr( 'size', this.field.settings.size )
		}
	},

	getInputType: function() {
		return "text";
	},

	getValue: function() {
		return this.input.val();
	},

    tryCreateUtmHint: function () {
        if (!window.utmFormFieldHelpLink) {
            return;
        }

        var utmName = this.field.label.replace('gc_system.', '');
        utmName = utmName.replace(/gc_system_[a-zA-Z]+_/, '');
        var helpLinkText = window.tt('common', 'Подробнее');
        var helpLinkClassString = '';

        if (window.isAccountRedesignEnabled) {
            helpLinkClassString = 'class="rd-link"';
        }

        var utmHelpLink = '<a ' + helpLinkClassString + ' href="' + window.utmFormFieldHelpLink
            + '" target="_blank">' + helpLinkText + '</a>';
        var text = window.tt('common', 'Поле предназначено для сбора') + ' ' + utmName + ' '
            + window.tt('common', 'метки') + '. ' + utmHelpLink;
        $('<p>' + text + '</p>').appendTo(this.paramsEl);
    },

    hideUtmSettings: function () {
        this.settingsEl.find('.field-description').hide();
        this.settingsEl.find('.field-table_title').hide();
        this.settingsEl.find('.field-is_important').hide();
        this.settingsEl.find('.field-placeholder').hide();
        this.settingsEl.find('.field-label').hide();
    }
} );
