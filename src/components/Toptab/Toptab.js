import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import searchPng from "../../assets/images/search.png"
import ico1Png from "../../assets/images/2D.png"
import ico2Png from "../../assets/images/3D.png"
import heart from "../../assets/images/heart.png"
import "./Toptab.scss"

export default class Toptab extends Component {
    constructor(props) {
        super(...arguments);
        let data = Taro.getStorageSync("cities");
        this.state = {
            name: data.geoCity ? data.geoCity.nm : '',
            id: data.geoCity ? data.geoCity.id : '',
            navTab: ["正在热映", "即将上映"],
            currentNavtab: 0,
            onList: [],
            movieIds: null,
            startIndex: 0,
            lastIndex: 0,
        }
    }

    switchTab(index) {
        console.log(index)
        this.setState({
            currentNavtab: index,
        })
    }

    //获取正在热映列表数据
    getMoviesOnList() {
        let cityId = this.state.id
        Taro.showLoading({
            title: "加载中"
        });
        Taro.request({
            url: "https://m.maoyan.com/ajax/movieOnInfoList?token=",
            method: "GET",
            header: {
                "Cookie": `_lxsdk_cuid=164b6cae2cac8-02b7b032f571b5-39614706-1fa400-164b6cae2cbc8; v=3; iuuid=1A6E888B4A4B29B16FBA1299108DBE9CA19FF6972813B39CA13A8D9705187374; revrev=76338a29; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; webp=true; __mta=3463951.1532075108184.1533098338076.1533118040602.20; _lxsdk=1A6E888B4A4B29B16FBA1299108DBE9CA19FF6972813B39CA13A8D9705187374; from=canary; selectci=true; __mta=3463951.1532075108184.1533118040602.1533118773295.21; _lxsdk_s=164f4f4c9e9-45e-d1b-46%7C%7C50; ci=${cityId}`
            }
        }).then(res => {
            Taro.hideLoading();
            res.data.movieList.forEach((value) => {
                let arr = value["img"].split("w.h");
                value["img"] = arr[0] + "128.180" + arr[1]
            })
            this.setState({
                onList: res.data.movieList,
                startIndex: res.data.movieList.length,
                lastIndex: res.data.total - 1,
                movieIds: res.data.movieIds
            })
        })
    }
    appendToList() {
        console.log('30')
        //     Taro.showLoading({title:'加载中'})
        //     let url = 'https://m.maoyan.com/ajax/moreComingList?token=&movieIds=';
        //     let startIndex = this.state.startIndex;
        //     let lastIndex = this.state.lastIndex;
        //     if(startIndex >= lastIndex){
        //         Taro.showToast({
        //           title: '没有更多数据了',
        //           icon: 'success',
        //           duration: 2000
        //         });
        //         return false;
        //       }
    }


    componentDidMount() {
        this.getMoviesOnList();
    }
    render() {
        return (
            <View>
                // 头部切换
                <View className='top-tab flex-wrp flex-tab'>
                    <View className="location">
                        {this.state.name}
                        <View className='cityArrow'></View>
                    </View>
                    {
                        this.state.navTab.map((item, index) => {
                            return (
                                <View className={this.state.currentNavtab === index ? 'toptab flex-item active' : 'toptab flex-item'} key={index} onClick={this.switchTab.bind(this, index)}>{item}</View>
                            )
                        })
                    }
                    <View className="search">
                        <Image src={searchPng}></Image>
                    </View>
                </View>
                //正在热映 
                <ScrollView scroll-y scroll-top='45' lowerThreshold='30' style='height:100vh' onScrolltolower={this.appendToList.bind(this)} scrollWithAnimation>
                    <View className="tabItemContent" hidden={this.state.currentNavtab === 0 ? false : true}>
                        {this.onList.map((item, index) => {
                            return (
                                <View className="dataItem" key={index}>
                                    <View className="leftItem">
                                        <Image src={item.img}></Image>
                                    </View>
                                    <View className="rightItem">
                                        <View className="itemContent">
                                            <View className="title">
                                                <Text>{item.nm}</Text>
                                                <View className="icon">
                                                    {item.version == 'v3d imax' ? <Image src={ico2Png}></Image> : <Image src={ico1Png}></Image> }
                                                </View>
                                            </View>
                                            {item.globalReleased ? <View className="comment smallFont">观众评 <Text className="yellow">{item.sc}</Text></View> : <View className="comment smallFont"><Text className="yellow">{item.wish}</Text>人想看</View>}
                                            <View className="person smallFont">主演: {item.star}</View>
                                            <View className="showInfo smallFont">{item.showInfo}</View>
                                        </View>
                                        <View className="operate">
                                            {item.showst === 4 ? <View className="preBuy">预售</View> : <View className="buyTicket">购票</View>}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}