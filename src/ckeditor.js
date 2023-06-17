/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use. 
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
//import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
//import Font from '@ckeditor/ckeditor5-font/src/font';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
//import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import StandardUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/standarduploadadapter';
import TableResize from './ckeditor_table/tableresize';
import ImageResize from './ckeditor_image/imageresize'; 
import TableSelect from './ckeditor_table/tableselect';
import TableColor from './ckeditor_table/tablecolor';
import TableLine from './ckeditor_table/tableline';
import TableMerge from './ckeditor_table/tablemerge';
import ImageMngt from './ckeditor_upload/imagemngt';
import MagicWidget from './ckeditor_magicwidget/magicwidget';
import BootstrapGrid from './ckeditor_grid/bootstrapgrid';
import Padding from './ckeditor_padding/padding';
import Margin from './ckeditor_margin/margin';
import Border from './ckeditor_border/border';
import Background from './ckeditor_background/background';
import Position from './ckeditor_position/position';
import CopyFormat from './ckeditor_copyformat/copyformat';
import Font from './ckeditor_font/src/font';
import Menu from './eveng_menu/menu';
import shape_square from './ckeditor_shape/shape_square';
import shape_oval from './ckeditor_shape/shape_oval';
import icons from './ckeditor_icons/icons';
import blade from './ckeditor_blade/blade';
import html from './ckeditor_html/html';
import TablePadding from './ckeditor_table/tablepadding.js';

import './default.js';
import './constants.js';
import './ui/editor.css';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [ 
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	//ImageCaption,
	ImageStyle,
	//ImageToolbar,
	ImageUpload,
	ImageMngt,
	ImageResize,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	Table,
	TableToolbar,
	Font,
	Alignment,
	TableResize,
	TableSelect,
	TableColor,
	TableLine,
	TableMerge,
	StandardUploadAdapter,
	Underline,
	BootstrapGrid,
	html,
	shape_square,
	shape_oval,
	Padding,
	Margin,
	Border,
	MagicWidget,
	Background,
	Position,
	CopyFormat,
	icons,
	Menu,
	blade,
	TablePadding,
	
	
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
		    'cpformatButton',
			'undo',
			'redo',
		    '|',
			'heading',
			'alignment',
			'indent',
			'outdent',
			'paddingButton',
			'marginButton',
			'|',
			'bold',
			'italic',
			'underline',
			'link',
			'bulletedList',
			'numberedList',
			'imagemngt',
			'blockQuote',
			'mediaEmbed',
			'|',
			'insertTable', 
			'tableColumn',
			'tableRow',
			'mergeTableCells', 
			'colorTable',
			'lineTable',
			'paddingTableButton',
			'|',
			'fontSize', 
			'fontFamily', 
			'fontColor', 
			'fontBackgroundColor',
			'borderButton',
			'backgroundButton',
			'|',
			'squareButton',
			'ovalButton',
			'|',
			'insertGrid',
			// 'paddingButton',
			// 'marginButton',
			// 'borderButton',
			// 'backgroundButton',
			'positionButton',

			// '|',

			'menuButton',
			'iconsButton',
			'bladeButton',
			'htmlButton',
			
			
		]
	},
	link: {
        decorators: {
            addTargetToLinks: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }
        }
	},
	menu: {
		onCreate: (id, title)=>{
			console.log(id);
			console.log(title);
		}
	},
	image: {
		toolbar: [
			'imageStyle:alignLeft', 
			'imageStyle:full', 
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative'
		],
		styles: ['full','alignLeft','alignRight'],
		imgmngt:{
			table: '',
			column: '',
			link: '',
			onClick: path=>path,
			type: 'base64'
		}
	},
	//	extraPlugins: [ StandardUploadAdapter ],
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
