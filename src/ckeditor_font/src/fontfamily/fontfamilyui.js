/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontfamily/fontfamilyui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { FONT_FAMILY } from '../utils';
import fontFamilyIcon from '../../theme/icons/font-family.svg';

/**
 * The font family UI plugin. It introduces the `'fontFamily'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontFamilyUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		const options = editor.config.get( FONT_FAMILY ).options;

		const command = editor.commands.get( FONT_FAMILY );

		// Register UI component.
		editor.ui.componentFactory.add( FONT_FAMILY, locale => {
			const dropdownView = createDropdown( locale );
			addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

			dropdownView.buttonView.set( {
				label: t( 'Font Family' ),
				icon: fontFamilyIcon,
				tooltip: true
			} );

			dropdownView.extendTemplate( {
				attributes: {
					class: 'ck-font-family-dropdown'
				}
			} );

			dropdownView.bind( 'isEnabled' ).to( command );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( evt.source.commandName, { value: evt.source.commandParam } );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}

	/**
	 * Returns options as defined in `config.fontFamily.options` but processed to account for
	 * editor localization, i.e. to display {@link module:font/fontfamily~FontFamilyOption}
	 * in the correct language.
	 *
	 * Note: The reason behind this method is that there is no way to use {@link module:utils/locale~Locale#t}
	 * when the user configuration is defined because the editor does not exist yet.
	 *
	 * @private
	 * @returns {Array.<module:font/fontfamily~FontFamilyOption>}.
	 */
	
}

// Prepares FontFamily dropdown items.
// @private
// @param {Array.<module:font/fontsize~FontSizeOption>} options
// @param {module:font/fontsize/fontsizecommand~FontSizeCommand} command
function _prepareListOptions( options, command ) {
	const itemDefinitions = new Collection();

	// Create dropdown items.
	for ( let option in options ) {
		const def = {
			type: 'button',
			model: new Model( {
				commandName: FONT_FAMILY,
				commandParam: options[option],
				label: option,
				withText: true
			} )
		};

		def.model.bind( 'isOn' ).to( command, 'value', value => value === options[option] );

		// Try to set a dropdown list item style.
		
		def.model.set( 'labelStyle', `font-family: ${ option }` );

		itemDefinitions.add( def );
	}
	return itemDefinitions;
}
