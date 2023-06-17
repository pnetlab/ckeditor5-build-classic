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
import makePadding from './paddingFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import PaddingComp from './ui/PaddingComp';

import {getSelectElement} from '../helper/selection';

/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Padding extends Plugin {
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
		return 'Padding';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();



		editor.ui.componentFactory.add('paddingButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Padding'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});


			var ui = new ReactView(locale, <PaddingComp ref={ui => this.paddingUI = ui}
				onChange={(left, right, top, bottom) => { this._paddingCtrl(left, right, top, bottom) }}>
			</PaddingComp>);

			dropdownView.buttonView.on('execute', () => {
				this.paddingUI.setValue(this._getPadding());
			})

			dropdownView.panelView.children.add(ui);
			return dropdownView;

		});

		var schema = this.editor.model.schema;
		
		if(schema.isRegistered( 'paragraph' )) makePadding(editor, 'paragraph');
		if(schema.isRegistered( 'listItem' )) makePadding(editor, 'listItem');
		if(schema.isRegistered( 'heading3' )) makePadding(editor, 'heading3');
		if(schema.isRegistered( 'heading2' )) makePadding(editor, 'heading2');
		if(schema.isRegistered( 'heading1' )) makePadding(editor, 'heading1');
		
		if(schema.isRegistered( 'row' )) makePadding(editor, 'row');
		if(schema.isRegistered( 'column' )) makePadding(editor, 'column');
		if(schema.isRegistered( 'box' )) makePadding(editor, 'box');

		if(schema.isRegistered( 'html' )) makePadding(editor, 'html');


	}

	_paddingCtrl(left, right, top, bottom) {

		this.editor.model.change(writer => {
			var paddingable = this._getPaddingable(writer);
			paddingable.map(item=>{
				this._setPadding(item, left, right, top, bottom, writer);
			})
		})

	}

	_getPaddingable() {
		var selection = this.editor.model.document.selection;
		var validElement = [];
		if(selection.isCollapsed){
			var parent = findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'paddingable') });
			if(parent) validElement.push(parent);
			return validElement;
		}

		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'paddingable')) {
				validElement.push(selectionElement);
				return validElement;
			}
		}

		validElement = getSelectElement(selection, item => this.editor.model.schema.checkAttribute(item, 'paddingable'));
		return validElement;
		
	}

	_setPadding(paddingableElement, left, right, top, bottom, writer) {

		var values = {};
		if (isset(left)) values.paddingLeft = left;
		if (isset(right)) values.paddingRight = right;
		if (isset(top)) values.paddingTop = top;
		if (isset(bottom)) values.paddingBottom = bottom;
		writer.setAttributes(values, paddingableElement);

	}

	_getPadding() {
		var paddingableElement = this._getPaddingable();

		if (paddingableElement[0]) {
			paddingableElement = paddingableElement[0];
			return {
				left: paddingableElement.getAttribute('paddingLeft'),
				right: paddingableElement.getAttribute('paddingRight'),
				top: paddingableElement.getAttribute('paddingTop'),
				bottom: paddingableElement.getAttribute('paddingBottom'),
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
						'padding-left': /.+/
					}
				},
				model: {
					key: 'paddingLeft',
					value: viewElement => viewElement.getStyle('padding-left')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'padding-right': /.+/
					}
				},
				model: {
					key: 'paddingRight',
					value: viewElement => viewElement.getStyle('padding-right')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'padding-top': /.+/
					}
				},
				model: {
					key: 'paddingTop',
					value: viewElement => viewElement.getStyle('padding-top')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'padding-bottom': /.+/
					}
				},
				model: {
					key: 'paddingBottom',
					value: viewElement => viewElement.getStyle('padding-bottom')
				}
			});

	}



}



