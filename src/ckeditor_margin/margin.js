/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import makeMargin from './marginFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import MarginComp from './ui/MarginComp';
import {getSelectElement} from '../helper/selection';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Margin extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Margin';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();



		editor.ui.componentFactory.add('marginButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Margin'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});


			var ui = new ReactView(locale, <MarginComp ref={ui => this.marginUI = ui}
				onChange={(left, right, top, bottom) => { this._marginCtrl(left, right, top, bottom) }}>
			</MarginComp>);

			dropdownView.buttonView.on('execute', () => {
				this.marginUI.setValue(this._getmargin());
			})

			dropdownView.panelView.children.add(ui);

			return dropdownView;

		});
		var schema = this.editor.model.schema;
		
		if(schema.isRegistered( 'paragraph' )) makeMargin(editor, 'paragraph');
		if(schema.isRegistered( 'listItem' )) makeMargin(editor, 'listItem');
		if(schema.isRegistered( 'heading3' )) makeMargin(editor, 'heading3');
		if(schema.isRegistered( 'heading2' )) makeMargin(editor, 'heading2');
		if(schema.isRegistered( 'heading1' )) makeMargin(editor, 'heading1');
		
		if(schema.isRegistered( 'square' )) makeMargin(editor, 'square');
		if(schema.isRegistered( 'oval' )) makeMargin(editor, 'oval');
		if(schema.isRegistered( 'row' )) makeMargin(editor, 'row');
		if(schema.isRegistered( 'column' )) makeMargin(editor, 'column');
		if(schema.isRegistered( 'box' )) makeMargin(editor, 'box');
		if(schema.isRegistered( 'image' )) makeMargin(editor, 'image');

		if(schema.isRegistered( 'html' )) makeMargin(editor, 'html');
		if(schema.isRegistered( 'table' )) makeMargin(editor, 'table');


	}

	_marginCtrl(left, right, top, bottom) {
		this.editor.model.change(writer => {
			var marginable = this._getmarginable();
			marginable.map(item => {
				this._setmargin(item, left, right, top, bottom, writer);
			})
		})
	}

	_getmarginable() {
		var selection = this.editor.model.document.selection;
		var validElement = [];
		if(selection.isCollapsed){
			var parent = findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'marginable') });
			if(parent) validElement.push(parent);
			return validElement;
		}

		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'marginable')) {
				validElement.push(selectionElement);
				return validElement;
			}
		}

		validElement = getSelectElement(selection, item => this.editor.model.schema.checkAttribute(item, 'marginable'));
		return validElement;

	}

	_setmargin(marginableElement, left, right, top, bottom, writer) {

		var values = {};
		if (isset(left)) values.marginLeft = left;
		if (isset(right)) values.marginRight = right;
		if (isset(top)) values.marginTop = top;
		if (isset(bottom)) values.marginBottom = bottom;
	
		writer.setAttributes(values, marginableElement);

	}

	_getmargin() {
		var marginableElement = this._getmarginable();

		if (marginableElement[0]) {
			marginableElement = marginableElement[0];
			return {
				left: marginableElement.getAttribute('marginLeft'),
				right: marginableElement.getAttribute('marginRight'),
				top: marginableElement.getAttribute('marginTop'),
				bottom: marginableElement.getAttribute('marginBottom'),
			}
		} else {
			return {};
		}

	}

	_registerSchema() {

	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;

		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'margin-left': /.+/
					}
				},
				model: {
					key: 'marginLeft',
					value: viewElement => viewElement.getStyle('margin-left')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'margin-right': /.+/
					}
				},
				model: {
					key: 'marginRight',
					value: viewElement => viewElement.getStyle('margin-right')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'margin-top': /.+/
					}
				},
				model: {
					key: 'marginTop',
					value: viewElement => viewElement.getStyle('margin-top')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'margin-bottom': /.+/
					}
				},
				model: {
					key: 'marginBottom',
					value: viewElement => viewElement.getStyle('margin-bottom')
				}
			});

	}



}



