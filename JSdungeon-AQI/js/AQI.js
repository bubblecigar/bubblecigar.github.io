const heroku = `https://cors-anywhere.herokuapp.com/`;
const url = `${heroku}http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json`;


var dataBase = [];
if(!store.get('AQI')){
	fetch(url).then(response=>{
		return response.json();
	})
	.then(promise=>{
		const ar = JSON.parse(JSON.stringify(promise));
		console.log(ar);
		store.set('AQI',ar);
	})
	.catch(er=>{
		console.log(er);
	});
}else{
	dataBase = store.get('AQI');
}


const vue = new Vue({
	el:'#bodyWrap',
	data:{
		data: dataBase,
		showMenu: false,
		selectedCounty: '請選擇地區',
		updateString: '',
		selectedSite: {
			County: '',
			SiteName: '--',
			AQI: '--',
			O3: '--',
			PM10: '--',
			'PM2.5': '--',
			CO: '--',
			SO2: '--',
			NO2: '--',
			status: ''
		},

	},
	methods:{
		toogleMenu: function(){
			this.showMenu = !this.showMenu;
		},
		selectCounty: function(){
			this.selectedCounty = event.target.textContent;
			this.updateTime();
			this.selectedSite = {
				County: '',
				SiteName: '--',
				AQI: '--',
				O3: '--',
				PM10: '--',
				'PM2.5': '--',
				CO: '--',
				SO2: '--',
				NO2: '--',
				status: ''
			}
		},
		updateTime: function(){
			let date = new Date();
			let str = '';
			str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()} 更新`;
			this.updateString = str;
		},
		selectSite: function(el){
			this.selectedSite = el;
		},
		statusClass: function(el){
			if (el.AQI > 50) {
				return 'AQI-100'
			}else{
				return 'AQI-50'
			}
		}

	},
	computed:{
		countyList: function(){
			let ar = [];
			for(el of this.data){
				if (!ar.includes(el.County)) {
					ar.push(el.County);
				}
			}
			return ar
		},
		siteNameList: function(){
			let ar = [];
			for(el of this.data){
				if (el.County === this.selectedCounty) {
					ar.push(el);
				}
			}
			return ar
		},
		
	}
});

console.log(vue);