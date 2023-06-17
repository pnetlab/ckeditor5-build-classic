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
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';

import SizeCtrl from './ui/SizeCtrl'

import React, { Component } from 'react'
import ReactView from '../ui/reactview';

/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MagicWidgetFactory {
	
	constructor(editor) { 
	    this.editor = editor;
	}
	
	
	
	make(viewWriter, modelElement, viewElement, options={}){
		this.options = options;
		this.me = modelElement;
		this.ve = viewElement;
		this.viewWriter = viewWriter;
		
		this.init();
		
		modelElement['magicwidget_factory'] = this;
		
		viewWriter.addClass('editing', viewElement);
		
//		viewWriter.setStyle({
//			position:'relative',
//		}, viewElement)
		
		viewWriter.setAttribute( 'key', Date.now()+Math.random(), viewElement );
		
		var elementEvents = {...viewElement.events};
		
		viewElement.events = Object.assign(viewElement.events, {
	    	click: (ve, de, evt)=>{
	    		
	    		evt.stopPropagation(); 
	    		this.editor['magicwidget_selected']={}; 
	    		this._showSelectWidget();
	    		this._hideAllBalloon();
	    		if(typeof(elementEvents.click) == 'function') elementEvents.click(ve, de, evt);
	    	},
	    	
	    	dblclick: (ve, de, evt)=>{
	    		evt.stopPropagation(); 
	    		this.editor.model.change( writer => {
	    			var me = this.editor.editing.mapper.toModelElement(ve);
	    			var paragraph = writer.createElement( 'paragraph', {style: 'margin-bottom:0px'});
	    			writer.append(paragraph, me);
	    			writer.setSelection( paragraph, 'in' );
	            } );
	    		if(typeof(elementEvents.dblclick) == 'function') elementEvents.dblclick(ve, de, evt);
	    	},
	    	
	    	dragstart: (ve, de, event)=>{event.stopPropagation(); this.editor['magicwidget_draged'] = this.ve},
			drop:(ve, de, event)=>{event.stopPropagation(); this._drop()},
	  		dragover:(ve, de, event)=>{event.stopPropagation(); event.preventDefault(); this._dragOver()},
	  		dragenter:(ve, de, event)=>{event.stopPropagation()},
		    dragleave:(ve, de, event)=>{event.stopPropagation(); this._dragLeave()},
	    	
	    });
		
		
		if(this.options['resize']){
			viewWriter.addClass('resize', viewElement);
			viewElement.events.mouseup = (ve, de, ev)=>{
				console.log('mouseup');
	    		var offsetBt =  de.offsetHeight - ev.offsetY;
	    		var offsetRi =  de.offsetWidth - ev.offsetX;
	    		if(offsetBt >=0 && offsetBt <=15 && offsetRi >=0 && offsetRi <=15){
	    			var wunit = get(modelElement.getAttribute('wunit'), '%');
	    			var hunit = get(modelElement.getAttribute('hunit'), 'px');
	    			
	    			var parentWidth = de.parentNode.clientWidth;
	    			var parentHeight = de.parentNode.clientHeight;
	    			
	    			var width = de.clientWidth;
	    			var height = de.clientHeight;
	    			
	    			if(wunit == '%'){
	    				width = Math.ceil(width*100/parentWidth);
	    				if(width > 100) width=100;
	    			}
	    			if(hunit == '%'){
	    				height = Math.ceil(height*100/parentHeight);
	    				if(height > 100) height=100;
	    			}
	    			this._resize(width, wunit, height, hunit);
	    			
	    			if(typeof(elementEvents.mouseup) == 'function') elementEvents.mouseup(ve, de, ev);
	    			
	    		}
	    	}
		}
		
	
		
        const eagleLeft = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle left', title:modelElement.name, style:`border-color: ${get(this.options.color, '')} ; border-width: ${get(this.options.weight, '')}` }, {click: (ve, de, ev)=>{this._selectWidget(ev, de)}} );
        viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleLeft);
        
        const eagleRight = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle right', title:modelElement.name, style:`border-color: ${get(this.options.color, '')} ; border-width: ${get(this.options.weight, '')}` }, {click: (ve, de, ev)=>{this._selectWidget(ev, de)}});
        viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleRight);
        
        const eagleTop = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle top', title:modelElement.name, style:`border-color: ${get(this.options.color, '')} ; border-width: ${get(this.options.weight, '')}` }, {click: (ve, de, ev)=>{this._selectWidget(ev, de)}});
        viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleTop);
        
        const eagleBottom = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle bottom', title:modelElement.name, style:`border-color: ${get(this.options.color, '')} ; border-width: ${get(this.options.weight, '')}`}, {click: (ve, de, ev)=>{this._selectWidget(ev, de)}});
        viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleBottom);
        
        this.editor.editing.mapper.bindElements( modelElement, viewElement);
        
        return viewElement;
		
	}
	
	
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this.balloonPanel = new BalloonPanelView( this.editor.locale );
		
		
		var toolBar = new ReactView(this.editor.locale, <div style={{display: 'flex', padding:3, alignItems:'center'}}>
				<label style={{fontWeight: 'bold'}}>{this.me.name.toUpperCase()}</label>
				{this.options['resize']==true ? <>
						&nbsp;<div style={{borderLeft:'solid thin darkgray', top:0, bottom:0, alignSelf: 'stretch'}}></div>&nbsp;
						<SizeCtrl ref={sizeCtrl => this.widthCtrl = sizeCtrl} label="Width" units={['px', '%']} onChange={(width, wunit)=>{this._resize(width, wunit)}}/>
						&nbsp;<div style={{borderLeft:'solid thin darkgray', top:0, bottom:0, alignSelf: 'stretch'}}></div>&nbsp;
						<SizeCtrl ref={sizeCtrl => this.heightCtrl = sizeCtrl} label="Height" units={['px', '%']} onChange={(height, hunit)=>{this._resize(null, null, height, hunit)}}/> 
					</>
				: ''}
				
				{this.options.toolbar != null ? this.options.toolbar: ''}
				</div>
		)
		
		// Add a child view to the panel's content collection.
		this.balloonPanel.content.add( toolBar );
		editor.ui.view.body.add( this.balloonPanel );
		//editor.ui.focusTracker.add( this.balloonPanel.element );
		
		
		this.editor['magicwidget_balloon'][this.balloonPanel.viewUid] = this.balloonPanel;
		
		var widgetDocumentClick = (event, dom)=>{
			event.stop();
			this.editor['magicwidget_selected']={};
			this._hideAllBalloon();
		}
		this.editor.editing.view.document.on('click', widgetDocumentClick);
		
		this.balloonPanel.viewElement = this.ve;
		this.balloonPanel.clickCallback = widgetDocumentClick;
		
		
	}
	
	
	

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	
	
	_resize(width, wunit, height, hunit){
		
		
		
//		this.editor.editing.view.change( writer => {
//			var style = {};
//			if(isset(width) && isset(wunit)){
//				style['width'] = width + wunit;
//			}
//			if(isset(height) && isset(hunit)){
//				style['height'] = height + hunit;
//			}
//			writer.setStyle( style , ve);
//		});
		
		this.editor.model.change( writer => {
			
			var attrs = {};
			if(isset(width) && isset(wunit)){
				attrs['width'] = width;
				attrs['wunit'] = wunit;
			}
			if(isset(height) && isset(hunit)){
				attrs['height'] = height;
				attrs['hunit'] = hunit;
			}
			writer.setAttributes(attrs , this.me);
        } );
		
		if(typeof(this.ve.events.resize) == 'function') this.ve.events.resize(width, wunit, height, hunit);
	}
	
	_drop(){
		
		if(!this.editor['magicwidget_draged']) return;
		var dragModel = this.editor.editing.mapper.toModelElement(this.editor['magicwidget_draged']);
		if(!dragModel) return;
		
		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', this.ve);
		})
		
		this.editor.model.change(writer=>{
			var position = writer.createPositionAfter(this.me);
			try {
				writer.insert(dragModel, position);
			} catch (e) {
				return;
			}
			
		});
		
	}
	
	_dragOver(){
		if(typeof(allowWidgetOverEvent)=='undefined' || !allowWidgetOverEvent){
			global.allowWidgetOverEvent = true;
			setTimeout(()=>{global.allowWidgetOverEvent = false}, 1000);
			this.editor.editing.view.change(writer => {
				writer.addClass('dragover', this.ve);
			})
		}
	}
	
	_dragLeave(){
		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', this.ve);
		})
	}
	
	_selectWidget(event, de){
		
		if(event) event.stopPropagation();
		this.editor['magicwidget_selected']={};
		
		this.editor['magicwidget_selected'][this.ve.getAttribute('key')] = this.me;
		
		this._showSelectWidget();
		this._hideAllBalloon();
		
		const positions = BalloonPanelView.defaultPositions;
		this.balloonPanel.pin( {
		    target: get(de, this.editor.editing.view.domConverter.mapViewToDom(this.ve)),
		    positions: [
		        positions.northArrowSouth,
		        positions.southArrowNorth
		    ]
		} );
		
		if(this.widthCtrl) this.widthCtrl.setValue(this.me.getAttribute('width'), this.me.getAttribute('wunit'));
		if(this.heightCtrl) this.heightCtrl.setValue(this.me.getAttribute('height'), this.me.getAttribute('hunit'));
		
		
		this.editor.model.change( writer => {
		    var start = writer.createPositionBefore(this.me);
		    var end = writer.createPositionAfter(this.me);
		    var range = writer.createRange( start, end );
		    writer.setSelection( range );
		});
		
		if(isset(this.options.onSelect)) {
			this.options.onSelect(this.me, this.ve);
		}
		
	}
	
	_showSelectWidget(){
		
		this.editor.editing.view.change(writer => {
			var widgets = findChildren(this.editor.editing.view.document.getRoot(),(element)=>{return element.hasClass('magic_widget','editing','selected')});
			for (let i in widgets){
				writer.removeClass('selected', widgets[i]);
			}
			
			for(let i in this.editor['magicwidget_selected']){
				var widget = this.editor['magicwidget_selected'][i];
				if(widget){
					var widgetView = this.editor.editing.mapper.toViewElement(widget);
					if(widgetView){
						writer.addClass('selected', widgetView);
					}
				}
			}
		})
	}
	
	_hideAllBalloon(){
		var balloons = this.editor['magicwidget_balloon'];
		if(!balloons || balloons.length == 0) return;
		for(let i in balloons){
			try{
				balloons[i].unpin();
				if(!this.editor.editing.mapper.toModelElement(balloons[i].viewElement)){
					this.editor.ui.view.body.remove(balloons[i]);
					this.editor.editing.view.document.off('click', balloons[i].clickCallback);
					delete(this.editor['magicwidget_balloon'][i]);
				}
			}catch (e) {
				console.log(e);
			}
		}
		
		
	}

	
	
}





