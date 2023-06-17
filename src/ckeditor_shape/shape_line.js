/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import magicWidgetRegister from '../ckeditor_magicwidget/widgetRegister';
import MagicWidgetFactory from '../ckeditor_magicwidget/widgetFactory';
import React, { Component } from 'react'
import ReactView from '../ui/reactview';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class shape_line extends Plugin {
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
		return 'shape_line';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();

		magicWidgetRegister(this.editor, 'line');


		editor.ui.componentFactory.add('lineButton', locale => {

			var ui = new ReactView(locale, <div className='button' style={{ 
				width: 15, height: 15, 
				borderRadius: 2, 
				border: 'solid thin', 
				cursor: 'pointer', 
				borderRadius:'50%', 
				background: '#bbf7ff', 
				margin: '0px 5px' 
			}} onClick={() => { this.insertBox() }}></div>);
			return ui;

		});



	}

	insertBox() {
		this.editor.model.change(writer => {
			// Insert <simpleBox>*</simpleBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			const selection = this.editor.model.document.selection;
			var lineIteam = writer.createElement('line');

			var container = findParent(selection.getFirstPosition(), (item) => this.editor.model.schema.checkChild(item, 'line'));
			if (container) {
				writer.append(lineIteam, container);
			}
		});
	}

	_registerSchema() {

		this.editor.model.schema.register('line', {
			allowWhere: '$block',
			allowContentOf: '$block',
			allowAttributes: [
				'type', 'color', 'style', 'startSym', 'endSym'
			],
			defaults: {
				width: '200',
				wunit: 'px',
				height: '50',
				hunit: 'px',
				color: 'black',
				style: 'solid',
				type: 'traight'
			},
			isLimit: true,
			isObject: true,
			isBlock: true,
		});



	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */

	_createMarker(writer, sym){
		switch (sym) {
			case trian:
				var trianMarker = writer.createEmptyElement('marker', {id:`trian${id}`, viewBox:"0 0 10 10", refX:"5", refY:"5", markerWidth:"6", markerHeight:"6", orient:"auto-start-reverse"});
				var trianMarkerPath = writer.createEmptyElement('path', {d:"M 0 10 L 10 5 L 0 0 z"});
				writer.append(trianMarkerPath, trianMarker);
				return trianMarker;
			case arrow:
				var arrowMarker = writer.createEmptyElement('marker', {id:`arrow${id}`, viewBox:"0 0 10 10", refX:"5", refY:"5", markerWidth:"6", markerHeight:"6", orient:"auto-start-reverse"});
				var arrowMarkerPath = writer.createEmptyElement('path', {d:"M 0 10 L 10 5 L 0 0 L 3 5 z"});
				writer.append(arrowMarkerPath, arrowMarker);
				return arrowMarker;
			case dot:
				var dotMarker = writer.createEmptyElement('marker', {id:`dot${id}`, viewBox:"0 0 10 10", refX:"5", refY:"5", markerWidth:"6", markerHeight:"6", orient:"auto-start-reverse"});
				var dotMarkerPath = writer.createEmptyElement('circle', {cx:"5", cy:"5", r:"5"});
				writer.append(dotMarkerPath, dotMarker);
				return dotMarker;
			case square:
				var squareMarker = writer.createEmptyElement('marker', {id:`square${id}`, viewBox:"0 0 10 10", refX:"5", refY:"5", markerWidth:"6", markerHeight:"6", orient:"auto-start-reverse"});
				var squareMarkerPath = writer.createEmptyElement('rect', {width:10, height:10});
				writer.append(squareMarkerPath, squareMarker);
				return squareMarker;
			default:
				break;
		}
	}

	_createLine(writer, color, style, startSym, endSym){
		var id = makeId();
		var line = writer.createEmptyElement('div', {
			class: 'line',
			data_color: color,
			data_style: style,
			data_startSym: startSym,
			data_endSym: endSym,
		})
		var cssColor = '';
		if(color !='') cssColor = `stroke: ${color}; fill: ${color}`

		var className = 'line_border_solid';
		if(style != '') className = `line_border_${style}`;

		var svg = writer.createEmptyElement('svg', {width:'100%', height:'100%', style: cssColor, 'class':className});

		var pathData = 'M 10 25 L 190 25';
		if(style)
		

		

		



	}

	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for('dataDowncast').elementToElement({
			model: 'line',
			view: (modelElement, viewWriter) => {

				var color = modelElement.getAttribute('color');
				var style = modelElement.getAttribute('style');
				var startSym = modelElement.getAttribute('startSym');
				var endSym = modelElement.getAttribute('endSym');

				if(!isset(color) || color =='') color = 'black';
				if(!isset(style) || style =='') style = 'solid';
				if(!isset(startSym) || startSym =='') startSym = '';
				if(!isset(endSym) || endSym =='') endSym = '';

				viewWriter.createContainerElement('div', { 
					class: 'line' 
				})
			}
		});

		editor.conversion.for('upcast').elementToElement({
			view: {
				name: 'div',
				classes: 'line'
			},
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('line');
			}
		});

		editor.conversion.for('editingDowncast').elementToElement({
			model: 'line',
			view: (modelElement, viewWriter) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement('div', { class: 'line', style:"cursor:pointer" }, null, {
					click: (ve, de, ev) => {
						var shapeModel = this.editor.editing.mapper.toModelElement(ve);
						this.editor['magicwidget_selected'] = {1: shapeModel};
						shapeModel['magicwidget_factory']._showSelectWidget();
						this.editor.model.change(writer => {
							var start = writer.createPositionBefore(shapeModel);
							var end = writer.createPositionAfter(shapeModel);
							var range = writer.createRange(start, end);
							writer.setSelection(range);
						})
					}
				});
				var widgetFactory = new MagicWidgetFactory(this.editor);
				var line = widgetFactory.make(viewWriter, modelElement, div, { resize: 'both', color: '#2196F3', editable: true });
				return line;
			}
		});




	}



}



