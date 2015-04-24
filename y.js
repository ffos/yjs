!function t(e,n,r){function i(s,u){if(!n[s]){if(!e[s]){var l="function"==typeof require&&require;if(!u&&l)return l(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=n[s]={exports:{}};e[s][0].call(p.exports,function(t){var n=e[s][1][t];return i(n?n:t)},p,p.exports,t,e,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e){var n,r;n=t("./ConnectorClass"),r=function(t,e,r,i){var o,s,u,l,p,c,a,h;for(c in n)u=n[c],t[c]=u;return t.setIsBoundToY(),h=function(e){return e.uid.creator===r.getUserId()&&"string"!=typeof e.uid.op_number&&"_temp"!==r.getUserId()?t.broadcast(e):void 0},null!=t.invokeSync&&r.setInvokeSyncHandler(t.invokeSync),i.push(h),s=function(t){var e,n;n=[];for(c in t)e=t[c],n.push({user:c,state:e});return n},a=function(t){var e,n,r,i;for(n={},r=0,i=t.length;i>r;r++)e=t[r],n[e.user]=e.state;return n},p=function(){return s(r.getOperationCounter())},l=function(t){var e,n,i;return i=a(t),e=r._encode(i),n={hb:e,state_vector:s(r.getOperationCounter())}},o=function(t,n){return e.applyOp(t,n)},t.getStateVector=p,t.getHB=l,t.applyHB=o,null==t.receive_handlers&&(t.receive_handlers=[]),t.receive_handlers.push(function(t,n){return n.uid.creator!==r.getUserId()?e.applyOp(n):void 0})},e.exports=r},{"./ConnectorClass":2}],2:[function(t,e){e.exports={init:function(t){var e;return e=function(e){return function(n,r){if(null!=t[n]){if(null==r||r.some(function(e){return e===t[n]}))return e[n]=t[n];throw new Error("You can set the '"+n+"' option to one of the following choices: "+JSON.encode(r))}throw new Error("You must specify "+n+", when initializing the Connector!")}}(this),e("syncMethod",["syncAll","master-slave"]),e("role",["master","slave"]),e("user_id"),"function"==typeof this.on_user_id_set&&this.on_user_id_set(this.user_id),this.perform_send_again=null!=t.perform_send_again?t.perform_send_again:!0,"master"===this.role&&(this.syncMethod="syncAll"),this.is_synced=!1,this.connections={},null==this.receive_handlers&&(this.receive_handlers=[]),this.connections={},this.current_sync_target=null,this.sent_hb_to_all_users=!1,this.is_initialized=!0},isRoleMaster:function(){return"master"===this.role},isRoleSlave:function(){return"slave"===this.role},findNewSyncTarget:function(){var t,e,n;if(this.current_sync_target=null,"syncAll"===this.syncMethod){n=this.connections;for(e in n)if(t=n[e],!t.is_synced){this.performSync(e);break}}return null==this.current_sync_target&&this.setStateSynced(),null},userLeft:function(t){return delete this.connections[t],this.findNewSyncTarget()},userJoined:function(t,e){var n;if(null==e)throw new Error("Internal: You must specify the role of the joined user! E.g. userJoined('uid:3939','slave')");if(null==(n=this.connections)[t]&&(n[t]={}),this.connections[t].is_synced=!1,!this.is_synced||"syncAll"===this.syncMethod){if("syncAll"===this.syncMethod)return this.performSync(t);if("master"===e)return this.performSyncWithMaster(t)}},whenSynced:function(t){return t.constructore===Function&&(t=[t]),this.is_synced?t[0].apply(this,t.slice(1)):(null==this.compute_when_synced&&(this.compute_when_synced=[]),this.compute_when_synced.push(t))},onReceive:function(t){return this.receive_handlers.push(t)},performSync:function(t){var e,n,r,i,o;if(null==this.current_sync_target&&(this.current_sync_target=t,this.send(t,{sync_step:"getHB",send_again:"true",data:[]}),!this.sent_hb_to_all_users)){for(this.sent_hb_to_all_users=!0,e=this.getHB([]).hb,r=[],i=0,o=e.length;o>i;i++)n=e[i],r.push(n),r.length>10&&(this.broadcast({sync_step:"applyHB_",data:r}),r=[]);return this.broadcast({sync_step:"applyHB",data:r})}},performSyncWithMaster:function(t){var e,n,r,i,o;for(this.current_sync_target=t,this.send(t,{sync_step:"getHB",send_again:"true",data:[]}),e=this.getHB([]).hb,r=[],i=0,o=e.length;o>i;i++)n=e[i],r.push(n),r.length>10&&(this.broadcast({sync_step:"applyHB_",data:r}),r=[]);return this.broadcast({sync_step:"applyHB",data:r})},setStateSynced:function(){var t,e,n,r;if(!this.is_synced){if(this.is_synced=!0,null!=this.compute_when_synced){for(r=this.compute_when_synced,e=0,n=r.length;n>e;e++)t=r[e],t();delete this.compute_when_synced}return null}},receiveMessage:function(t,e){var n,r,i,o,s,u,l,p,c,a,h,_,d;if(null==e.sync_step){for(_=this.receive_handlers,d=[],p=0,a=_.length;a>p;p++)r=_[p],d.push(r(t,e));return d}if(t!==this.user_id)if("getHB"===e.sync_step){for(n=this.getHB(e.data),i=n.hb,l=[],s=this.is_synced?function(e){return function(n){return e.send(t,n)}}(this):function(t){return function(e){return t.broadcast(e)}}(this),c=0,h=i.length;h>c;c++)o=i[c],l.push(o),l.length>10&&(s({sync_step:"applyHB_",data:l}),l=[]);if(s({sync_step:"applyHB",data:l}),null!=e.send_again&&this.perform_send_again)return u=function(e){return function(n){return function(){return i=e.getHB(n).hb,e.send(t,{sync_step:"applyHB",data:i,sent_again:"true"})}}}(this)(n.state_vector),setTimeout(u,3e3)}else if("applyHB"===e.sync_step){if(this.applyHB(e.data,t===this.current_sync_target),!("syncAll"!==this.syncMethod&&null==e.sent_again||this.is_synced||this.current_sync_target!==t&&null!=this.current_sync_target))return this.connections[t].is_synced=!0,this.findNewSyncTarget()}else if("applyHB_"===e.sync_step)return this.applyHB(e.data,t===this.current_sync_target)},parseMessageFromXml:function(t){var e,n;return e=function(t){var r,i,o,s,u;for(s=t.children,u=[],i=0,o=s.length;o>i;i++)r=s[i],"true"===r.getAttribute("isArray")?u.push(e(r)):u.push(n(r));return u},n=function(t){var r,i,o,s,u,l,p,c,a;i={},c=t.attrs;for(s in c)u=c[s],r=parseInt(u),i[s]=isNaN(r)||""+r!==u?u:r;for(a=t.children,l=0,p=a.length;p>l;l++)o=a[l],s=o.name,i[s]="true"===o.getAttribute("isArray")?e(o):n(o);return i},n(t)},encodeMessageToXml:function(t,e){var n,r;if(r=function(t,e){var i,o;for(i in e)o=e[i],null==o||(o.constructor===Object?r(t.c(i),o):o.constructor===Array?n(t.c(i),o):t.setAttribute(i,o));return t},n=function(t,e){var i,o,s;for(t.setAttribute("isArray","true"),o=0,s=e.length;s>o;o++)i=e[o],i.constructor===Object?r(t.c("array-element"),i):n(t.c("array-element"),i);return t},e.constructor===Object)return r(t.c("y",{xmlns:"http://y.ninja/connector-stanza"}),e);if(e.constructor===Array)return n(t.c("y",{xmlns:"http://y.ninja/connector-stanza"}),e);throw new Error("I can't encode this json!")},setIsBoundToY:function(){return"function"==typeof this.on_bound_to_y&&this.on_bound_to_y(),delete this.when_bound_to_y,this.is_bound_to_y=!0}}},{}],3:[function(t,e){var n;"undefined"!=typeof window&&null!==window&&(window.unprocessed_counter=0),"undefined"!=typeof window&&null!==window&&(window.unprocessed_exec_counter=0),"undefined"!=typeof window&&null!==window&&(window.unprocessed_types=[]),n=function(){function t(t,e){this.HB=t,this.types=e,this.unprocessed_ops=[]}return t.prototype.parseOperation=function(t){var e;if(e=this.types[t.type],null!=(null!=e?e.parse:void 0))return e.parse(t);throw new Error("You forgot to specify a parser for type "+t.type+". The message is "+JSON.stringify(t)+".")},t.prototype.applyOpsCheckDouble=function(t){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],null==this.HB.getOperation(e.uid)?i.push(this.applyOp(e)):i.push(void 0);return i},t.prototype.applyOps=function(t){return this.applyOp(t)},t.prototype.applyOp=function(t,e){var n,r,i,o;for(null==e&&(e=!1),t.constructor!==Array&&(t=[t]),i=0,o=t.length;o>i;i++)r=t[i],e&&(r.fromHB="true"),n=this.parseOperation(r),n.parsed_from_json=r,null!=r.fromHB&&(n.fromHB=r.fromHB),null!=this.HB.getOperation(n)||(!this.HB.isExpectedOperation(n)&&null==n.fromHB||!n.execute())&&(this.unprocessed_ops.push(n),"undefined"!=typeof window&&null!==window&&window.unprocessed_types.push(n.type));return this.tryUnprocessed()},t.prototype.tryUnprocessed=function(){for(var t,e,n,r,i,o;;){for(t=this.unprocessed_ops.length,n=[],o=this.unprocessed_ops,r=0,i=o.length;i>r;r++)e=o[r],null!=this.HB.getOperation(e)||(!this.HB.isExpectedOperation(e)&&null==e.fromHB||!e.execute())&&n.push(e);if(this.unprocessed_ops=n,this.unprocessed_ops.length===t)break}return 0!==this.unprocessed_ops.length?this.HB.invokeSync():void 0},t}(),e.exports=n},{}],4:[function(t,e){var n,r=function(t,e){return function(){return t.apply(e,arguments)}};n=function(){function t(t){this.user_id=t,this.emptyGarbage=r(this.emptyGarbage,this),this.operation_counter={},this.buffer={},this.change_listeners=[],this.garbage=[],this.trash=[],this.performGarbageCollection=!0,this.garbageCollectTimeout=3e4,this.reserved_identifier_counter=0,setTimeout(this.emptyGarbage,this.garbageCollectTimeout)}return t.prototype.resetUserId=function(t){var e,n,r;if(r=this.buffer[this.user_id],null!=r){for(n in r)e=r[n],null!=e.uid.creator&&(e.uid.creator=t),null!=e.uid.alt&&(e.uid.alt.creator=t);if(null!=this.buffer[t])throw new Error("You are re-assigning an old user id - this is not (yet) possible!");this.buffer[t]=r,delete this.buffer[this.user_id]}return null!=this.operation_counter[this.user_id]&&(this.operation_counter[t]=this.operation_counter[this.user_id],delete this.operation_counter[this.user_id]),this.user_id=t},t.prototype.emptyGarbage=function(){var t,e,n,r;for(r=this.garbage,e=0,n=r.length;n>e;e++)t=r[e],"function"==typeof t.cleanup&&t.cleanup();return this.garbage=this.trash,this.trash=[],-1!==this.garbageCollectTimeout&&(this.garbageCollectTimeoutId=setTimeout(this.emptyGarbage,this.garbageCollectTimeout)),void 0},t.prototype.getUserId=function(){return this.user_id},t.prototype.addToGarbageCollector=function(){var t,e,n,r;if(this.performGarbageCollection){for(r=[],e=0,n=arguments.length;n>e;e++)t=arguments[e],null!=t?r.push(this.garbage.push(t)):r.push(void 0);return r}},t.prototype.stopGarbageCollection=function(){return this.performGarbageCollection=!1,this.setManualGarbageCollect(),this.garbage=[],this.trash=[]},t.prototype.setManualGarbageCollect=function(){return this.garbageCollectTimeout=-1,clearTimeout(this.garbageCollectTimeoutId),this.garbageCollectTimeoutId=void 0},t.prototype.setGarbageCollectTimeout=function(t){this.garbageCollectTimeout=t},t.prototype.getReservedUniqueIdentifier=function(){return{creator:"_",op_number:"_"+this.reserved_identifier_counter++}},t.prototype.getOperationCounter=function(t){var e,n,r,i;if(null==t){n={},i=this.operation_counter;for(r in i)e=i[r],n[r]=e;return n}return this.operation_counter[t]},t.prototype.isExpectedOperation=function(t){var e,n;return null==(e=this.operation_counter)[n=t.uid.creator]&&(e[n]=0),t.uid.op_number<=this.operation_counter[t.uid.creator],!0},t.prototype._encode=function(t){var e,n,r,i,o,s,u,l,p,c;null==t&&(t={}),e=[],l=function(e,n){if(null==e||null==n)throw new Error("dah!");return null==t[e]||t[e]<=n},c=this.buffer;for(u in c)if(p=c[u],"_"!==u)for(o in p)if(n=p[o],null==n.uid.noOperation&&l(u,o)){if(r=n._encode(),null!=n.next_cl){for(i=n.next_cl;null!=i.next_cl&&l(i.uid.creator,i.uid.op_number);)i=i.next_cl;r.next=i.getUid()}else if(null!=n.prev_cl){for(s=n.prev_cl;null!=s.prev_cl&&l(s.uid.creator,s.uid.op_number);)s=s.prev_cl;r.prev=s.getUid()}e.push(r)}return e},t.prototype.getNextOperationIdentifier=function(t){var e;return null==t&&(t=this.user_id),null==this.operation_counter[t]&&(this.operation_counter[t]=0),e={creator:t,op_number:this.operation_counter[t]},this.operation_counter[t]++,e},t.prototype.getOperation=function(t){var e,n;return null!=t.uid&&(t=t.uid),e=null!=(n=this.buffer[t.creator])?n[t.op_number]:void 0,null!=t.sub&&null!=e?e.retrieveSub(t.sub):e},t.prototype.addOperation=function(t){if(null==this.buffer[t.uid.creator]&&(this.buffer[t.uid.creator]={}),null!=this.buffer[t.uid.creator][t.uid.op_number])throw new Error("You must not overwrite operations!");if(t.uid.op_number.constructor!==String&&!this.isExpectedOperation(t)&&null==t.fromHB)throw new Error("this operation was not expected!");return this.addToCounter(t),this.buffer[t.uid.creator][t.uid.op_number]=t,t},t.prototype.removeOperation=function(t){var e;return null!=(e=this.buffer[t.uid.creator])?delete e[t.uid.op_number]:void 0},t.prototype.setInvokeSyncHandler=function(t){return this.invokeSync=t},t.prototype.invokeSync=function(){},t.prototype.renewStateVector=function(t){var e,n,r;r=[];for(n in t)e=t[n],(null==this.operation_counter[n]||this.operation_counter[n]<t[n])&&null!=t[n]?r.push(this.operation_counter[n]=t[n]):r.push(void 0);return r},t.prototype.addToCounter=function(t){var e,n;if(null==(e=this.operation_counter)[n=t.uid.creator]&&(e[n]=0),t.uid.creator!==this.getUserId()){for(t.uid.op_number===this.operation_counter[t.uid.creator]&&this.operation_counter[t.uid.creator]++;null!=this.buffer[t.uid.creator][this.operation_counter[t.uid.creator]];)this.operation_counter[t.uid.creator]++;return void 0}},t}(),e.exports=n},{}],5:[function(t,e){var n;if(n=function(){function t(e){var n,r,i;if(this._object=null!=e?e:{},this._object.constructor!==Object)throw new Error("Y.Object accepts Json Objects only");i=this._object;for(n in i)r=i[n],r.constructor===Object&&(this._object[n]=new t(r))}return t.prototype._name="Object",t.prototype._getModel=function(t,e){var n,r,i;if(null==this._model){this._model=new e.MapManager(this).execute(),i=this._object;for(n in i)r=i[n],this._model.val(n,r)}return delete this._object,this._model},t.prototype._setModel=function(t){return this._model=t,delete this._object},t.prototype.observe=function(t){return this._model.observe(t),this},t.prototype.unobserve=function(t){return this._model.unobserve(t),this},t.prototype.val=function(t,e){var n,r,i,o;if(null!=this._model)return this._model.val.apply(this._model,arguments);if(null!=e)return this._object[t]=e;if(null!=t)return this._object[t];r={},o=this._object;for(n in o)i=o[n],r[n]=i;return r},t.prototype["delete"]=function(t){return this._model["delete"](t),this},t}(),"undefined"!=typeof window&&null!==window){if(null==window.Y)throw new Error("You must first import Y!");window.Y.Object=n}"undefined"!=typeof e&&null!==e&&(e.exports=n)},{}],6:[function(t,e){var n=[].slice,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};e.exports=function(){var t,e;return e={},t=[],e.Operation=function(){function r(t,e,n,r){var i,o;if(null!=t&&(this.custom_type=t),this.is_deleted=!1,this.garbage_collected=!1,this.event_listeners=[],null!=e&&(this.uid=e),void 0===n||(null!=n&&null!=n.creator?this.saveOperation("content",n):this.content=n),null!=r){this.content_operations={};for(i in r)o=r[i],this.saveOperation(i,o,"content_operations")}}return r.prototype.type="Operation",r.prototype.getContent=function(t){var e,n,r,i,o;if(null!=this.content){if(null!=this.content.getCustomType)return this.content.getCustomType();if(this.content.constructor===Object){if(null!=t)return null!=this.content[t]?this.content[t]:this.content_operations[t].getCustomType();e={},i=this.content;for(n in i)r=i[n],e[n]=r;if(null!=this.content_operations){o=this.content_operations;for(n in o)r=o[n],r=r.getCustomType(),e[n]=r}return e}return this.content}return this.content},r.prototype.retrieveSub=function(){throw new Error("sub properties are not enable on this operation type!")},r.prototype.observe=function(t){return this.event_listeners.push(t)},r.prototype.unobserve=function(t){return this.event_listeners=this.event_listeners.filter(function(e){return t!==e})},r.prototype.deleteAllObservers=function(){return this.event_listeners=[]},r.prototype["delete"]=function(){return new e.Delete(void 0,this).execute(),null},r.prototype.callEvent=function(){var t;return t=null!=this.custom_type?this.getCustomType():this,this.forwardEvent.apply(this,[t].concat(n.call(arguments)))},r.prototype.forwardEvent=function(){var t,e,r,i,o,s,u;for(r=arguments[0],t=2<=arguments.length?n.call(arguments,1):[],s=this.event_listeners,u=[],i=0,o=s.length;o>i;i++)e=s[i],u.push(e.call.apply(e,[r].concat(n.call(t))));return u},r.prototype.isDeleted=function(){return this.is_deleted},r.prototype.applyDelete=function(t){return null==t&&(t=!0),!this.garbage_collected&&(this.is_deleted=!0,t)?(this.garbage_collected=!0,this.HB.addToGarbageCollector(this)):void 0},r.prototype.cleanup=function(){return this.HB.removeOperation(this),this.deleteAllObservers()},r.prototype.setParent=function(t){this.parent=t},r.prototype.getParent=function(){return this.parent},r.prototype.getUid=function(){var t;return null==this.uid.noOperation?this.uid:null!=this.uid.alt?(t=this.uid.alt.cloneUid(),t.sub=this.uid.sub,t):void 0},r.prototype.cloneUid=function(){var t,e,n,r;e={},r=this.getUid();for(t in r)n=r[t],e[t]=n;return e},r.prototype.execute=function(){var e,n,r;if(this.validateSavedOperations()){if(this.is_executed=!0,null==this.uid&&(this.uid=this.HB.getNextOperationIdentifier()),null==this.uid.noOperation)for(this.HB.addOperation(this),n=0,r=t.length;r>n;n++)e=t[n],e(this._encode());return this}return!1},r.prototype.saveOperation=function(t,e,n){var r,i,o,s,u,l,p;if(null==n&&(n="this"),null!=e&&null!=e._getModel&&(e=e._getModel(this.custom_types,this.operations)),null!=e){if(null!=e.execute||null==e.op_number||null==e.creator){if("this"===n)return this[t]=e;for(r=this[n],s=t.split("/"),i=s.pop(),l=0,p=s.length;p>l;l++)o=s[l],r=r[o];return r[i]=e}return null==this.unchecked&&(this.unchecked={}),null==(u=this.unchecked)[n]&&(u[n]={}),this.unchecked[n][t]=e}},r.prototype.validateSavedOperations=function(){var t,e,n,r,i,o,s,u,l,p,c,a,h,_;c={},p=!0,_=this.unchecked;for(e in _){t=_[e];for(i in t)if(s=t[i],o=this.HB.getOperation(s))if("this"===e)this[i]=o;else{for(n=this[e],l=i.split("/"),r=l.pop(),a=0,h=l.length;h>a;a++)u=l[a],n=n[u];n[r]=o}else null==c[e]&&(c[e]={}),c[e][i]=s,p=!1}return p?(delete this.unchecked,this):(this.unchecked=c,!1)},r.prototype.getCustomType=function(){var t,e,n,r,i;if(null==this.custom_type)return this;if(this.custom_type.constructor===String){for(t=this.custom_types,i=this.custom_type.split("."),n=0,r=i.length;r>n;n++)e=i[n],t=t[e];this.custom_type=new t,this.custom_type._setModel(this)}return this.custom_type},r.prototype._encode=function(t){var e,n,r,i,o;if(null==t&&(t={}),t.type=this.type,t.uid=this.getUid(),null!=this.custom_type&&(t.custom_type=this.custom_type.constructor===String?this.custom_type:this.custom_type._name),t.content=null!=(null!=(i=this.content)?i.getUid:void 0)?this.content.getUid():this.content,null!=this.content_operations){r={},o=this.content_operations;for(e in o)n=o[e],null!=n._getModel&&(n=n._getModel(this.custom_types,this.operations)),r[e]=n.getUid();t.content_operations=r}return t},r}(),e.Delete=function(t){function e(t,n,r){this.saveOperation("deletes",r),e.__super__.constructor.call(this,t,n)}return i(e,t),e.prototype.type="Delete",e.prototype._encode=function(){return{type:"Delete",uid:this.getUid(),deletes:this.deletes.getUid()}},e.prototype.execute=function(){var t;return this.validateSavedOperations()?(t=e.__super__.execute.apply(this,arguments),t&&this.deletes.applyDelete(this),t):!1},e}(e.Operation),e.Delete.parse=function(t){var e,n;return n=t.uid,e=t.deletes,new this(null,n,e)},e.Insert=function(t){function n(t,e,r,i,o,s,u,l){this.saveOperation("parent",i),this.saveOperation("prev_cl",s),this.saveOperation("next_cl",u),null!=l?this.saveOperation("origin",l):this.saveOperation("origin",s),n.__super__.constructor.call(this,t,o,e,r)}return i(n,t),n.prototype.type="Insert",n.prototype.val=function(){return this.getContent()},n.prototype.getNext=function(t){var e;for(null==t&&(t=1),e=this;t>0&&null!=e.next_cl;)e=e.next_cl,e.is_deleted||t--;return e.is_deleted,e},n.prototype.getPrev=function(t){var e;for(null==t&&(t=1),e=this;t>0&&null!=e.prev_cl;)e=e.prev_cl,e.is_deleted||t--;return e.is_deleted?null:e},n.prototype.applyDelete=function(t){var e,r;return null==this.deleted_by&&(this.deleted_by=[]),e=!1,null==this.parent||this.is_deleted||null==t||(e=!0),null!=t&&this.deleted_by.push(t),r=!1,this.next_cl.isDeleted()&&(r=!0),n.__super__.applyDelete.call(this,r),e&&this.parent.callOperationSpecificDeleteEvents(this,t),null!=this.prev_cl&&this.prev_cl.isDeleted()?this.prev_cl.applyDelete():void 0},n.prototype.cleanup=function(){var t,r,i,o,s;if(this.next_cl.isDeleted()){for(s=this.deleted_by,i=0,o=s.length;o>i;i++)t=s[i],t.cleanup();for(r=this.next_cl;"Delimiter"!==r.type;)r.origin===this&&(r.origin=this.prev_cl),r=r.next_cl;return this.prev_cl.next_cl=this.next_cl,this.next_cl.prev_cl=this.prev_cl,this.content instanceof e.Operation&&!(this.content instanceof e.Insert)&&(this.content.referenced_by--,this.content.referenced_by<=0&&!this.content.is_deleted&&this.content.applyDelete()),delete this.content,n.__super__.cleanup.apply(this,arguments)}},n.prototype.getDistanceToOrigin=function(){var t,e;for(t=0,e=this.prev_cl;;){if(this.origin===e)break;t++,e=e.prev_cl}return t},n.prototype.execute=function(){var t,r,i,o;if(this.validateSavedOperations()){if(this.content instanceof e.Operation&&(this.content.insert_parent=this,null==(o=this.content).referenced_by&&(o.referenced_by=0),this.content.referenced_by++),null!=this.parent&&(null==this.prev_cl&&(this.prev_cl=this.parent.beginning),null==this.origin?this.origin=this.prev_cl:"Delimiter"===this.origin&&(this.origin=this.parent.beginning),null==this.next_cl&&(this.next_cl=this.parent.end)),null!=this.prev_cl){for(t=this.getDistanceToOrigin(),i=this.prev_cl.next_cl,r=t;;){if(i===this.next_cl)break;if(i.getDistanceToOrigin()===r)i.uid.creator<this.uid.creator&&(this.prev_cl=i,t=r+1);else{if(!(i.getDistanceToOrigin()<r))break;r-t<=i.getDistanceToOrigin()&&(this.prev_cl=i,t=r+1)}r++,i=i.next_cl}this.next_cl=this.prev_cl.next_cl,this.prev_cl.next_cl=this,this.next_cl.prev_cl=this}return this.setParent(this.prev_cl.getParent()),n.__super__.execute.apply(this,arguments),this.parent.callOperationSpecificInsertEvents(this),this}return!1},n.prototype.getPosition=function(){var t,n;for(t=0,n=this.prev_cl;;){if(n instanceof e.Delimiter)break;n.isDeleted()||t++,n=n.prev_cl}return t},n.prototype._encode=function(t){return null==t&&(t={}),t.prev=this.prev_cl.getUid(),t.next=this.next_cl.getUid(),"Delimiter"===this.origin.type?t.origin="Delimiter":this.origin!==this.prev_cl&&(t.origin=this.origin.getUid()),t.parent=this.parent.getUid(),n.__super__._encode.call(this,t)},n}(e.Operation),e.Insert.parse=function(t){var e,n,r,i,o,s,u;return e=t.content,n=t.content_operations,u=t.uid,s=t.prev,r=t.next,i=t.origin,o=t.parent,new this(null,e,n,o,u,s,r,i)},e.Delimiter=function(t){function e(t,n){this.saveOperation("prev_cl",t),this.saveOperation("next_cl",n),this.saveOperation("origin",t),e.__super__.constructor.call(this,null,{noOperation:!0})}return i(e,t),e.prototype.type="Delimiter",e.prototype.applyDelete=function(){var t;for(e.__super__.applyDelete.call(this),t=this.prev_cl;null!=t;)t.applyDelete(),t=t.prev_cl;return void 0},e.prototype.cleanup=function(){return e.__super__.cleanup.call(this)},e.prototype.execute=function(){var t,n;if(null!=(null!=(t=this.unchecked)?t.next_cl:void 0))return e.__super__.execute.apply(this,arguments);if(null!=(n=this.unchecked)?n.prev_cl:void 0){if(this.validateSavedOperations()){if(null!=this.prev_cl.next_cl)throw new Error("Probably duplicated operations");return this.prev_cl.next_cl=this,e.__super__.execute.apply(this,arguments)}return!1}return null!=this.prev_cl&&null==this.prev_cl.next_cl?(delete this.prev_cl.unchecked.next_cl,this.prev_cl.next_cl=this,e.__super__.execute.apply(this,arguments)):e.__super__.execute.apply(this,arguments)},e.prototype._encode=function(){var t,e;return{type:this.type,uid:this.getUid(),prev:null!=(t=this.prev_cl)?t.getUid():void 0,next:null!=(e=this.next_cl)?e.getUid():void 0}},e}(e.Operation),e.Delimiter.parse=function(t){var e,n,r;return r=t.uid,n=t.prev,e=t.next,new this(r,n,e)},{operations:e,execution_listener:t}}},{}],7:[function(t,e){var n,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};n=t("./Basic"),e.exports=function(){var t,e;return t=n(),e=t.operations,e.MapManager=function(t){function n(t,e,r,i){this._map={},n.__super__.constructor.call(this,t,e,r,i)}return i(n,t),n.prototype.type="MapManager",n.prototype.applyDelete=function(){var t,e,r;r=this._map;for(t in r)e=r[t],e.applyDelete();return n.__super__.applyDelete.call(this)},n.prototype.cleanup=function(){return n.__super__.cleanup.call(this)},n.prototype.map=function(t){var e,n,r;r=this._map;for(e in r)n=r[e],t(e,n);return void 0},n.prototype.val=function(t,n){var r,i,o,s,u,l;if(arguments.length>1)return o=null!=n&&null!=n._getModel?n._getModel(this.custom_types,this.operations):n,this.retrieveSub(t).replace(o),this.getCustomType();if(null!=t)return i=this._map[t],null==i||i.isContentDeleted()?void 0:(s=i.val(),s instanceof e.Operation?s.getCustomType():s);u={},l=this._map;for(t in l)r=l[t],r.isContentDeleted()||(u[t]=r.val());return u},n.prototype["delete"]=function(t){var e;return null!=(e=this._map[t])&&e.deleteContent(),this},n.prototype.retrieveSub=function(t){var n,r,i,o;return null==this._map[t]&&(n={name:t},r=this,o={noOperation:!0,sub:t,alt:this},i=new e.ReplaceManager(null,n,r,o),this._map[t]=i,i.setParent(this,t),i.execute()),this._map[t]},n}(e.Operation),e.MapManager.parse=function(t){var e,n,r,i;return i=t.uid,r=t.custom_type,e=t.content,n=t.content_operations,new this(r,i,e,n)},e.ListManager=function(t){function n(t,r,i,o){this.beginning=new e.Delimiter(void 0,void 0),this.end=new e.Delimiter(this.beginning,void 0),this.beginning.next_cl=this.end,this.beginning.execute(),this.end.execute(),n.__super__.constructor.call(this,t,r,i,o)}return i(n,t),n.prototype.type="ListManager",n.prototype.applyDelete=function(){var t;for(t=this.beginning;null!=t;)t.applyDelete(),t=t.next_cl;return n.__super__.applyDelete.call(this)},n.prototype.cleanup=function(){return n.__super__.cleanup.call(this)},n.prototype.toJson=function(t){var n,r,i,o,s,u;for(null==t&&(t=!1),i=this.val(),u=[],r=o=0,s=i.length;s>o;r=++o)n=i[r],r instanceof e.Object?u.push(r.toJson(t)):r instanceof e.ListManager?u.push(r.toJson(t)):t&&r instanceof e.Operation?u.push(r.val()):u.push(r);return u},n.prototype.execute=function(){return this.validateSavedOperations()?(this.beginning.setParent(this),this.end.setParent(this),n.__super__.execute.apply(this,arguments)):!1},n.prototype.getLastOperation=function(){return this.end.prev_cl},n.prototype.getFirstOperation=function(){return this.beginning.next_cl},n.prototype.toArray=function(){var t,e;for(t=this.beginning.next_cl,e=[];t!==this.end;)t.is_deleted||e.push(t.val()),t=t.next_cl;return e},n.prototype.map=function(t){var e,n;for(e=this.beginning.next_cl,n=[];e!==this.end;)e.is_deleted||n.push(t(e)),e=e.next_cl;return n},n.prototype.fold=function(t,e){var n;for(n=this.beginning.next_cl;n!==this.end;)n.is_deleted||(t=e(t,n)),n=n.next_cl;return t},n.prototype.val=function(t){var n;if(null!=t){if(n=this.getOperationByPosition(t+1),n instanceof e.Delimiter)throw new Error("this position does not exist");return n.val()}return this.toArray()},n.prototype.ref=function(t){var n;if(null!=t)return n=this.getOperationByPosition(t+1),n instanceof e.Delimiter?null:n;throw new Error("you must specify a position parameter")},n.prototype.getOperationByPosition=function(t){var n;for(n=this.beginning;;){if(n instanceof e.Delimiter&&null!=n.prev_cl){for(n=n.prev_cl;n.isDeleted()&&null!=n.prev_cl;)n=n.prev_cl;break}if(0>=t&&!n.isDeleted())break;n=n.next_cl,n.isDeleted()||(t-=1)}return n},n.prototype.push=function(t){return this.insertAfter(this.end.prev_cl,[t])},n.prototype.insertAfter=function(t,n){var r,i,o,s,u;for(i=t.next_cl;i.isDeleted();)i=i.next_cl;if(t=i.prev_cl,n instanceof e.Operation)new e.Insert(null,content,null,void 0,void 0,t,i).execute();else for(s=0,u=n.length;u>s;s++)r=n[s],null!=r&&null!=r._name&&null!=r._getModel&&(r=r._getModel(this.custom_types,this.operations)),o=new e.Insert(null,r,null,void 0,void 0,t,i).execute(),t=o;return this},n.prototype.insert=function(t,e){var n;return n=this.getOperationByPosition(t),this.insertAfter(n,e)},n.prototype["delete"]=function(t,n){var r,i,o,s,u;for(null==n&&(n=1),s=this.getOperationByPosition(t+1),i=[],o=u=0;(n>=0?n>u:u>n)&&!(s instanceof e.Delimiter);o=n>=0?++u:--u){for(r=new e.Delete(null,void 0,s).execute(),s=s.next_cl;!(s instanceof e.Delimiter)&&s.isDeleted();)s=s.next_cl;i.push(r._encode())}return this},n.prototype.callOperationSpecificInsertEvents=function(t){var n;return n=function(t){return t instanceof e.Operation?t.getCustomType():t},this.callEvent([{type:"insert",reference:t,position:t.getPosition(),object:this.getCustomType(),changedBy:t.uid.creator,value:n(t.val())}])},n.prototype.callOperationSpecificDeleteEvents=function(t,e){return this.callEvent([{type:"delete",reference:t,position:t.getPosition(),object:this.getCustomType(),length:1,changedBy:e.uid.creator,oldValue:t.val()}])},n}(e.Operation),e.ListManager.parse=function(t){var e,n,r,i;return i=t.uid,r=t.custom_type,e=t.content,n=t.content_operations,new this(r,i,e,n)},e.Composition=function(t){function n(t,e,r,i,o){var s,u;if(this._composition_value=e,n.__super__.constructor.call(this,t,i),null!=o?this.tmp_composition_ref=o:this.composition_ref=this.end.prev_cl,null!=r){this.composition_value_operations={};for(s in r)u=r[s],this.saveOperation(s,u,"_composition_value")}}return i(n,t),n.prototype.type="Composition",n.prototype.execute=function(){return this.validateSavedOperations()?(this.getCustomType()._setCompositionValue(this._composition_value),delete this._composition_value,n.__super__.execute.apply(this,arguments)):!1},n.prototype.callOperationSpecificInsertEvents=function(t){var e;{if(null==this.tmp_composition_ref){if(this.composition_ref.next_cl===t)t.undo_delta=this.getCustomType()._apply(t.val());else{for(e=this.end.prev_cl;e!==t;)this.getCustomType()._unapply(e.undo_delta),e=e.prev_cl;for(;e!==this.end;)e.undo_delta=this.getCustomType()._apply(e.val()),e=e.next_cl}return this.composition_ref=this.end.prev_cl,this.callEvent([{type:"update",changedBy:t.uid.creator,newValue:this.val()}])}if(t.uid.creator===this.tmp_composition_ref.creator&&t.uid.op_number===this.tmp_composition_ref.op_number)for(this.composition_ref=t,delete this.tmp_composition_ref,e=t.next_cl;null!=e.next_cl;)e.isDeleted()||this.callOperationSpecificInsertEvents(e),e=e.next_cl}},n.prototype.callOperationSpecificDeleteEvents=function(){},n.prototype.applyDelta=function(t,n){return new e.Insert(null,t,n,this,null,this.end.prev_cl,this.end).execute(),void 0},n.prototype._encode=function(t){var e,r,i,o;if(null==t&&(t={}),e=this.getCustomType()._getCompositionValue(),t.composition_value=e.composition_value,null!=e.composition_value_operations){t.composition_value_operations={},o=e.composition_value_operations;for(r in o)i=o[r],t.composition_value_operations[r]=i.getUid()}return t.composition_ref=null!=this.composition_ref?this.composition_ref.getUid():this.tmp_composition_ref,n.__super__._encode.call(this,t)},n}(e.ListManager),e.Composition.parse=function(t){var e,n,r,i,o;return o=t.uid,i=t.custom_type,n=t.composition_value,r=t.composition_value_operations,e=t.composition_ref,new this(i,n,r,o,e)},e.ReplaceManager=function(t){function n(t,e,r,i){this.event_properties=e,this.event_this=r,null==this.event_properties.object&&(this.event_properties.object=this.event_this.getCustomType()),n.__super__.constructor.call(this,t,i)}return i(n,t),n.prototype.type="ReplaceManager",n.prototype.callEventDecorator=function(t){var e,n,r,i,o,s;if(!this.isDeleted()){for(i=0,o=t.length;o>i;i++){e=t[i],s=this.event_properties;for(n in s)r=s[n],e[n]=r}this.event_this.callEvent(t)}return void 0},n.prototype.callOperationSpecificInsertEvents=function(t){var e;return"Delimiter"===t.next_cl.type&&"Delimiter"!==t.prev_cl.type?(t.is_deleted||(e=t.prev_cl.val(),this.callEventDecorator([{type:"update",changedBy:t.uid.creator,oldValue:e}])),t.prev_cl.applyDelete()):"Delimiter"!==t.next_cl.type?t.applyDelete():this.callEventDecorator([{type:"add",changedBy:t.uid.creator}]),void 0
},n.prototype.callOperationSpecificDeleteEvents=function(t,e){return"Delimiter"===t.next_cl.type?this.callEventDecorator([{type:"delete",changedBy:e.uid.creator,oldValue:t.val()}]):void 0},n.prototype.replace=function(t,n){var r,i;return r=this.getLastOperation(),i=new e.Insert(null,t,null,this,n,r,r.next_cl).execute(),void 0},n.prototype.isContentDeleted=function(){return this.getLastOperation().isDeleted()},n.prototype.deleteContent=function(){return new e.Delete(null,void 0,this.getLastOperation().uid).execute(),void 0},n.prototype.val=function(){var t;return t=this.getLastOperation(),"function"==typeof t.val?t.val():void 0},n}(e.ListManager),t}},{"./Basic":6}],8:[function(t,e){var n,r,i,o,s;s=t("./Operations/Structured"),r=t("./HistoryBuffer"),n=t("./Engine"),i=t("./ConnectorAdapter"),o=function(t){var e,u,l,p,c,a,h;return h=null,null!=t.user_id?h=t.user_id:(h="_temp",t.on_user_id_set=function(t){return h=t,e.resetUserId(t)}),e=new r(h),a=s(e,this.constructor),c=a.operations,l=new n(e,c),i(t,l,e,a.execution_listener),c.Operation.prototype.HB=e,c.Operation.prototype.operations=c,c.Operation.prototype.engine=l,c.Operation.prototype.connector=t,c.Operation.prototype.custom_types=this.constructor,u=new o.Object,p=new c.MapManager(u,e.getReservedUniqueIdentifier()).execute(),u._setModel(p),u},e.exports=o,"undefined"!=typeof window&&null!==window&&(window.Y=o),o.Object=t("./ObjectType")},{"./ConnectorAdapter":1,"./Engine":3,"./HistoryBuffer":4,"./ObjectType":5,"./Operations/Structured":7}]},{},[8]);