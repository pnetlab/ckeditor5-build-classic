/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload/imageuploadui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import imageIcon from '@ckeditor/ckeditor5-image/theme/icons/upload-solid.svg';
import ImageBgUploadCommand from '../commands/imagebgupload';

/**
 * The image upload button plugin.
 *
 * For a detailed overview, check the {@glink features/image-upload/image-upload Image upload feature} documentation.
 *
 * Adds the `'imageUpload'` button to the {@link module:ui/componentfactory~ComponentFactory UI component factory}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadBgUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;
		editor.commands.add( 'imageBgUpload', new ImageBgUploadCommand( editor ) );
		// Setup `imageUpload` button.
		editor.ui.componentFactory.add( 'imageBgUpload', locale => {
			const view = new FileDialogButtonView( locale );
			const command = editor.commands.get( 'imageBgUpload' );

			view.set( {
				acceptedType: 'image/*',
				allowMultipleFiles: true
			} );

			view.buttonView.set( {
				label: t( ' Upload Image' ), 
				icon: imageIcon,
				withText: true,
				//tooltip: true
			} );

			view.buttonView.bind( 'isEnabled' ).to( command );

			view.on( 'done', ( evt, files ) => {
				const imagesToUpload = Array.from( files ).filter( isImageType );

				if ( imagesToUpload.length ) {
					editor.execute( 'imageBgUpload', { file: imagesToUpload } );
				}
			} );

			return view;
		} );
	}
}

function isImageType( file ) {
	const types = /^image\/(jpeg|png|gif|bmp)$/;

	return types.test( file.type );
}
