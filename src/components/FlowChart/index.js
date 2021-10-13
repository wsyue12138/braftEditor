import React, {
	Component
} from 'react';
import { Card,Spin } from 'antd';
import G6 from '@antv/g6';
import { getRole,lineBreak } from '@utils/utils';
import insertCss from 'insert-css';
import styles from './style.less';

insertCss(`
  .g6-tooltip {
  	max-width:350px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    word-break:break-all;
    word-wrap:break-word;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

export default class FlowChart extends Component {
	
	state = {
		loading:false
	}

	componentDidMount() {
		const { readonly=false } = this.props;
		if(!readonly){
			this.props.onRef(this);
		}
		this.nodes = [];
		this.edges = [];
		this.allStop = false;   //关键词禁用后，除去关键词编辑外，全部禁止
        this.getDatas();
	}
	
	//获取数据
	getDatas = () => {
		const { dispatch,multiple:{onceData},parentId=0,readonly=false } = this.props;
		let { id } = onceData;
		this.setState({loading:true});
		dispatch({
			type:'multiple/fetchGetQaKnowledgeTree',
			payload:{id:readonly ? parentId : id},
			callback:(res) => {
				let { success } = res;
				if(success){
					document.getElementById('mountNode').innerHTML = '';
					this.nodes = [];
					this.edges = [];
					this.createGraph();
				}
				this.setState({loading:false});
			}
		})	
	}
	
	//查找连接内容
	getConnectObj = (parentNodeId) => {
		const { multiple:{flowChatData} } = this.props;
		var obj = flowChatData.filter((item) => item.id === parentNodeId);
		return obj[0];
	}
	
	//答案内容构造
	setAnswerData = (parentData,onceData) => {
		const { changeLogUuid,flowCode,knowledgeStatus,answer='',updatePersonName='',lastUpdateTime='' } = onceData;
		let itemData = {...parentData,changeLogUuid,flowCode,knowledgeStatus,lastUpdateTime};
		itemData.id = parentData.id + '_' + onceData.knowledgeId;
		itemData.nodeContent = answer;
		itemData.nodeStatus = knowledgeStatus;
		itemData.lastUpdatePersonName = updatePersonName;
		return itemData;
	}
	
	//处理数据
	setDatas = () => {
		const { multiple:{flowChatData} } = this.props;
		flowChatData.map((item,index) => {
			const { nodeType,id,parentNodeId=0 } = item;
			const parentNodeType = nodeType === 1 ? 0 : this.getConnectObj(parentNodeId).nodeType;
			switch (nodeType){
				case 1:
					this.nodes.push({id:item.id + '',config:item});
					if(item.flowCode === "-1" && !item.nodeStatus){
						this.allStop = true;
					}else{
						this.allStop = false;
					}
					break;
				case 2:			//问句
					this.setQuestionFun(item);
					break;
				case 4:																	//答案
					this.setAnswerFun(item);
					break;
				case 5:																	//答案
					this.setQuestionFun(item);
					break;	
				default:
					break;
			}
		})
		let data = {
			nodes:this.nodes,
			edges:this.edges
		}
		
		
		return data
	}
	
	//问句数据处理
	setQuestionFun = (item) => {
		const { id,parentNodeId=0 } = item;
		const parentObj = this.getConnectObj(parentNodeId);
		const parentNodeType = parentObj.nodeType;
		let nodesObj = {};
		let edgesObj = {};
		if(parentNodeType === 3){
			edgesObj = {
				source: parentObj.parentNodeId + '',
				target: id + '',
				label:parentObj.nodeContent
			};
		}else{
			edgesObj = {
				source: parentNodeId + '',
				target: id + '',
			};
		}
		nodesObj = {id:item.id + '',config:item};
		this.nodes.push(nodesObj);
		this.edges.push(edgesObj);
	}
	
	//答案数据处理
	setAnswerFun = (item) => {
		const { id,parentNodeId=0,nodeContent=[] } = item;
		const parentObj = this.getConnectObj(parentNodeId);
		const parentNodeType = parentObj.nodeType;
		let onceData = {...item};
		let nodesObj = {};
		let edgesObj = {};
		let answerTxt = '';
		if(parentNodeType === 3){
			edgesObj = {
				source: parentObj.parentNodeId + '',
				target: id + '',
				label:parentObj.nodeContent
			};
		}else{
			edgesObj = {
				source: parentNodeId + '',
				target: id + '',
			};
		}
		nodeContent.map((val,i) => {
			const { answer='' } = val;
			answerTxt += answer + '\n';
		})
		onceData.nodeContent = answerTxt;
		onceData.answerList = nodeContent;
		nodesObj = {id:id + '',config:onceData};
		this.nodes.push(nodesObj);
		this.edges.push(edgesObj);
	}
	
	//文字设置
	setFontData = (content='',nodeType) => {
		let newContent1 = content.replace(/[(^*\n*)|(^*\r*)]/g,'');
		let newContent2 = newContent1.replace(/\\n/g, "");
		let _len = newContent2.length || 0;
		let onceStr = newContent2.substr(0, 14);
		let txt = onceStr;
		let lineNum = -10;
		if(nodeType === 1){   //关键词
			if(_len <= 14){
				txt = onceStr;
			}else
			if(_len > 14 && _len <= 28) {
				txt = onceStr + '\n' + newContent2.substr(14,14);
				lineNum = -7;
			}else{
				txt = onceStr + '\n' + newContent2.substr(14,10) + '...';
				lineNum = -7;
			}
		}else
		if(nodeType === 2 || nodeType === 4 || nodeType === 5){
			if(_len <= 14){
				txt = onceStr;
				lineNum = 17;
			}else
			if(_len > 14 && _len <= 28) {
				txt = onceStr + '\n' + newContent2.substr(14,14);
				lineNum = 15;
			}else
			if(_len > 28 && _len <= 42){
				txt = onceStr + '\n' + newContent2.substr(14,14) + '\n' + newContent2.substr(28,14);
				lineNum = 15;
			}else{
				txt = onceStr + '\n' + newContent2.substr(14,14) + '\n' + newContent2.substr(28,14) + '\n' + newContent2.substr(42,10) + '...';
				lineNum = 17;
			}
		}
		return {txt,lineNum};
	}
	
	//字符串分割
	splitStr = (lineNum,str) => {
		
	}

	//设置状态
	setKnowledgeStatus = (data) => {
		const {
			flowCode,
			nodeStatus,
			nodeType
		} = data;
		let stateColor;
		if(nodeType === 5 || nodeType === 1){
			stateColor = '';
		}else
		if(this.allStop){
			stateColor = '#AAAAAA';
		}else{
			switch(flowCode) {
				case '-1':
					stateColor = nodeStatus ? '' : '#AAAAAA';
					break;
				case '0':                       					//锁定
					stateColor = nodeType === 4 ? '#40586F' : '';
					break;
				case '1000':										//待审核
					stateColor = '#FF9400';
					break;
				case '1001':										//审核通过
					stateColor = '#FFD23A';
					break;
				case '1002':										//操作中
					stateColor = '#0099FF';
					break;
				case '1003':										//待生效
					stateColor = '#41D99A';
					break;
				default:
					stateColor = '';
					break;
			}
		}
		return stateColor;
	}

	//构建流程图
	createGraph = () => {
		const _this = this; 
		const width = document.getElementById('mountNode').scrollWidth;
		const height = document.getElementById('mountNode').scrollHeight;
		let data = this.setDatas();
		G6.registerNode('sql', {
			drawShape(cfg, group) {
				const {
					config
				} = cfg;
				const {
					nodeContent = '',
					nodeType
				} = config;
				let fillColor,rectHeight,stateY;
				const contentData = _this.setFontData(nodeContent,nodeType);
				const stateColor = _this.setKnowledgeStatus(config);
				switch(nodeType) {
					case 1:
						fillColor = '#507CF1';
						rectHeight = 50;
						stateY = -17;
						break;
					case 2:
						fillColor = '#FFA64E';
						rectHeight = 100;
						stateY = 9;
						break;
					case 4:
						fillColor = '#3ADC99';
						rectHeight = 100;
						stateY = 9;
						break;
					case 5:
						fillColor = '#B4B4B4';
						rectHeight = 100;
						stateY = 9;
						break;	
					default:
						fillColor = '';
						break;
				}
				const rect = group.addShape('rect', {
					attrs: {
						x: -125,
						y: -35,
						width: 250,
						height: rectHeight,
						radius: 4,
						stroke:fillColor,
						fill:fillColor,
						lineWidth: 3,
						fillOpacity: 0.2,
						cursor: 'pointer'
					},
					name: 'rect-shape',
				});
				if(stateColor) {
					group.addShape('rect', {
						attrs: {
							x: 140,
							y: stateY,
							width: 12,
							height: 12,
							fill:stateColor,
							radius: 6
						},
						name: 'react-sign',
					});
				}
				if(nodeContent) {
					group.addShape('text', {
						attrs: {
							text: contentData.txt,
							x: 0,
							y: contentData.lineNum,
							fill: '#333333',
							fontSize: 16,
							lineHeight: 20,
							textAlign: 'center',
							textBaseline: 'middle',
							cursor: 'pointer',
						},
						name: 'text-shape',
					});
				}
				return rect;
			},
		}, 'single-node');
		const graph = new G6.Graph({
			container: 'mountNode',
			width,
			height,
			layout: {
				type: 'dagre',
				nodesepFunc: d => {
					return 120;
				},
				controlPoints: true
			},
			defaultNode: {
				type: 'sql',
			},
			defaultEdge: {
				type: 'polyline',
				style: {
					radius: 20,
					//offset: 45,
					//endArrow: true,
					lineWidth: 2,
					stroke: '#507CF1',
				},
				labelCfg: {

					style: {
						stroke: 'white',
						lineWidth: 7,
					},
				}
			},
			nodeStateStyles: {
				hover: {
					fillOpacity: 0.6,
				}
			},
			modes: {
				default: [
					'drag-canvas',
					'zoom-canvas',
					'click-select',
					{
						type: 'tooltip',
						formatText(model) {
							const {config={}} = model;
							const { nodeContent='' } = config;
							let newContent = nodeContent.replace(/\\n/g, " \n");
							return newContent.replace(/[(^*\n*)|(^*\r*)]/g,'</br>');
						},
						offset: 25
					},
				],
			},
			fitView: true
		});
		graph.data(data);
		graph.render();
		graph.on('node:click', function(event) {
			const {
				_cfg: {
					model
				}
			} = event.item;
			_this.handleStateOperation(model);
		})

		graph.on('node:mouseenter', evt => {
			const {
				item
			} = evt;
			graph.setItemState(item, 'hover', true);
		});
		graph.on('node:mouseleave', evt => {
			const {
				item
			} = evt;
			graph.setItemState(item, 'hover', false);
		});
	}
	
	//状态判断
	
	
	//打开弹窗分类
	setDrawerType = (data) => {
		const { loading } = this.state;
		const { nodeType,nodeStatus,flowCode } = data;
		const { user,global } = this.props;
		const { knowledgeAuthority={} } = global;
		const { userdata={} } = user;
		const { userRoleVos=[] } = userdata;
		let multipleDrawerType = '';
		if(nodeType !== 5 && !loading){
			switch(flowCode){
				case '0':
					if(nodeType === 1){
						multipleDrawerType = 'edit';
					}
					break;
				case '-1':
					if(knowledgeAuthority.changeBtn){
						if(nodeType === 1){
							multipleDrawerType = 'edit';
						}else{
							if(!this.allStop && nodeStatus){
								multipleDrawerType = 'edit';
							}
						}
					}
					break;
				case '1000':
					if(knowledgeAuthority.examineBtn && !this.allStop){           
						multipleDrawerType = 'examine';
					}
					break;
				case '1001':
					if(knowledgeAuthority.handleBtn && !this.allStop){      
						multipleDrawerType = 'handle';
					}
					break;
				case '1002':
					if(knowledgeAuthority.handleBtn && !this.allStop){       
						multipleDrawerType = 'complete';
					}
					break;
				case '1003':
					if(nodeType === 1 && knowledgeAuthority.takeEffectBtn && !this.allStop){      
						multipleDrawerType = 'takeEffect';
					}
					break;	
				default:
					break;
			}
		}
		return multipleDrawerType;
	}
	
	//操作处理
	handleStateOperation = (data) => {
		const { multiple:{onceData},readonly=false } = this.props;
		if(readonly){return false};
		const { config } = data;
		const { nodeType } = config;
		const multipleDrawerType = this.setDrawerType(config);
		if(nodeType !== 1 && multipleDrawerType){
			const { dispatch } = this.props;
			dispatch({
				type:'multiple/setMultipleVisible',
				payload:{multipleVisible:true,multipleDrawerType,drawerWidth:422,onceData,nodeType,detailData:config}
			})	
		}
	}

	render() {
		const { loading } = this.state;
		return(
			<Card bordered={false} 
				style={{height: '100%'}}
				bodyStyle={{ width: '100%',height:'100%',textAlign:'center' }}
			>
				<div id="mountNode" style={{height:'100%'}}>
					
				</div>
				{
					loading ? (
						<div className={styles.loadingBox}>
							<Spin spinning={loading} size='large'></Spin>
						</div>
					) : ''
				}
				
				
			</Card>
		)
	}
}