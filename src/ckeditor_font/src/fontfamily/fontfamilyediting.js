/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontfamily/fontfamilyediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import FontFamilyCommand from './fontfamilycommand';
import { normalizeOptions } from './utils';
import { buildDefinition, FONT_FAMILY } from '../utils';

/**
 * The font family editing feature.
 *
 * It introduces the {@link module:font/fontfamily/fontfamilycommand~FontFamilyCommand command} and
 * the `fontFamily` attribute in the {@link module:engine/model/model~Model model} which renders
 * in the {@link module:engine/view/view view} as an inline `<span>` element (`<span style="font-family: Arial">`),
 * depending on the {@link module:font/fontfamily~FontFamilyConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontFamilyEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		// Define default configuration using font families shortcuts.
		editor.config.define( FONT_FAMILY, {
			options: {
				'Default': '',
				'Arial': 'Arial, Helvetica, sans-serif',
				'Courier New': 'Courier New, Courier, monospace',
				'Georgia': 'Georgia, serif',
				'Lucida Sans Unicode': 'Lucida Sans Unicode, Lucida Grande, sans-serif',
				'Tahoma': 'Tahoma, Geneva, sans-serif',
				'Times New Roman': 'Times New Roman, Times, serif',
				'Trebuchet MS': 'Trebuchet MS, Helvetica, sans-serif',
				'Verdana': 'Verdana, Geneva, sans-serif'
			}
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow fontFamily attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: FONT_FAMILY } );
		editor.model.schema.setAttributeProperties( FONT_FAMILY, {
			isFormatting: true,
			copyOnEnter: true
		} );

		editor.commands.add( FONT_FAMILY, new FontFamilyCommand( editor ) );
		
		
		
		
		editor.conversion.for( 'downcast' ).attributeToElement( {
		    model: {
		    	key: 'fontFamily',
		    },
		    view: ( modelAttributeValue, viewWriter ) => {
		        return viewWriter.createAttributeElement( 'span', { style: 'font-family:' + modelAttributeValue } );
		    }
		} );
		
		
		editor.conversion.for( 'upcast' ).elementToAttribute( {
			 			view: {
			 				name: 'span',
			 				styles: {
			 					'font-family':/.+/
							}
			 			},
			 			model: {
			 				key: 'fontFamily',
			 				value: viewElement => viewElement.getStyle( 'font-family' ),
			 			}
			 		} );
		
	}
}
