/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize/fontsizeediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import FontSizeCommand from './fontsizecommand';
import { normalizeOptions } from './utils';
import { buildDefinition, FONT_SIZE } from '../utils';

/**
 * The font size editing feature.
 *
 * It introduces the {@link module:font/fontsize/fontsizecommand~FontSizeCommand command} and the `fontSize`
 * attribute in the {@link module:engine/model/model~Model model} which renders in the {@link module:engine/view/view view}
 * as a `<span>` element with either:
 * * a style attribute (`<span style="font-size:12px">...</span>`),
 * * or a class attribute (`<span class="text-small">...</span>`)
 *
 * depending on the {@link module:font/fontsize~FontSizeConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontSizeEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		// Define default configuration using named presets.
		editor.config.define( FONT_SIZE, {
			options: [
				'8px',
				'9px',
				'10px',
				'11px',
				'12px',
				'14px',
				'16px',
				'18px',
				'20px',
				'22px',
				'24px',
				'26px',
				'28px',
				'36px',
				'48px',
				'72px',
			]
		} );

		// Define view to model conversion.
		const options = normalizeOptions( this.editor.config.get( 'fontSize.options' ) ).filter( item => item.model );

		// Add FontSize command.
		editor.commands.add( FONT_SIZE, new FontSizeCommand( editor ) );
		
		
		
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow fontSize attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: FONT_SIZE } );
		editor.model.schema.setAttributeProperties( FONT_SIZE, {
			isFormatting: true,
			copyOnEnter: true
		} );
		
		editor.conversion.for( 'downcast' ).attributeToElement( {
		    model: {
		    	key: 'fontSize',
		    },
		    view: ( modelAttributeValue, viewWriter ) => {
		        return viewWriter.createAttributeElement( 'span', { style: 'font-size:' + modelAttributeValue } );
		    }
		} );
		
		
		editor.conversion.for( 'upcast' ).elementToAttribute( {
			 			view: {
			 				name: 'span',
			 				styles: {
			 					'font-size':/.+/
							}
			 			},
			 			model: {
			 				key: 'fontSize',
			 				value: viewElement => viewElement.getStyle( 'font-size' ),
			 			}
			 		} );
		
		
		
	}
}
