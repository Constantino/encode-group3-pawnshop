import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import TokenPrice from "components/TokenPrice";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import DEX from "components/DEX";
import NFTBalance from "components/NFTBalance";
import Wallet from "components/Wallet";
import { Layout, Tabs } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import QuickStart from "components/QuickStart";
import Contract from "components/Contract/Contract";
import Text from "antd/lib/typography/Text";
import Ramper from "components/Ramper";
import MenuItems from "./components/MenuItems";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <TokenPrice
              address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
              chain="eth"
              image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
              size="40px"
            />
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/quickstart">
              <QuickStart isServerInfo={isServerInfo} />
            </Route>
            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/ethereum-boilerplate">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>
          ⭐️ Please star this{" "}
          <a href="https://github.com/ethereum-boilerplate/ethereum-boilerplate/" target="_blank" rel="noopener noreferrer">
            boilerplate
          </a>
          , every star makes us very happy!
        </Text>

        <Text style={{ display: "block" }}>
          🙋 You have questions? Ask them on the {""}
          <a target="_blank" rel="noopener noreferrer" href="https://forum.moralis.io/t/ethereum-boilerplate-questions/3951/29">
            Moralis forum
          </a>
        </Text>

        <Text style={{ display: "block" }}>
          📖 Read more about{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://moralis.io?utm_source=boilerplatehosted&utm_medium=todo&utm_campaign=ethereum-boilerplat"
          >
            Moralis
          </a>
        </Text>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <svg width="190" height="38" viewBox="0 0 180 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.5,0 C39.5832611,0 51,11.4167389 51,25.5 C51,39.5832611 39.5832611,51 25.5,51 C11.4167389,51 0,39.5832611 0,25.5 C0,11.4167389 11.4167389,0 25.5,0 Z M25.5,3 C13.0735931,3 3,13.0735931 3,25.5 C3,37.9264069 13.0735931,48 25.5,48 C37.9264069,48 48,37.9264069 48,25.5 C48,13.0735931 37.9264069,3 25.5,3 Z M149.148,33.392 C149.841333,33.392 150.46,33.496 151.004,33.704 C151.548,33.912 152.006667,34.2053333 152.38,34.584 C152.753333,34.9626667 153.038667,35.424 153.236,35.968 C153.433333,36.512 153.532,37.12 153.532,37.792 C153.532,38.4426667 153.452,39.0346667 153.292,39.568 C153.132,40.1013333 152.897333,40.56 152.588,40.944 C152.278667,41.328 151.894667,41.6266667 151.436,41.84 C150.977333,42.0533333 150.449333,42.16 149.852,42.16 C149.521333,42.16 149.212,42.128 148.924,42.064 C148.636,42 148.358667,41.9093333 148.092,41.792 L148.092,44.96 L145.708,44.96 L145.708,33.872 C145.921333,33.808 146.166667,33.7466667 146.444,33.688 C146.721333,33.6293333 147.012,33.5786667 147.316,33.536 C147.62,33.4933333 147.929333,33.4586667 148.244,33.432 C148.558667,33.4053333 148.86,33.392 149.148,33.392 Z M115.004,30.656 C115.750667,30.656 116.396,30.736 116.94,30.896 C117.484,31.056 117.932,31.232 118.284,31.424 L117.564,33.392 C117.254667,33.232 116.910667,33.0906667 116.532,32.968 C116.153333,32.8453333 115.697333,32.784 115.164,32.784 C114.566667,32.784 114.137333,32.8666667 113.876,33.032 C113.614667,33.1973333 113.484,33.4506667 113.484,33.792 C113.484,33.9946667 113.532,34.1653333 113.628,34.304 C113.724,34.4426667 113.86,34.568 114.036,34.68 C114.212,34.792 114.414667,34.8933333 114.644,34.984 C114.873333,35.0746667 115.126667,35.168 115.404,35.264 C115.98,35.4773333 116.481333,35.688 116.908,35.896 C117.334667,36.104 117.689333,36.3466667 117.972,36.624 C118.254667,36.9013333 118.465333,37.2266667 118.604,37.6 C118.742667,37.9733333 118.812,38.4266667 118.812,38.96 C118.812,39.9946667 118.449333,40.7973333 117.724,41.368 C116.998667,41.9386667 115.905333,42.224 114.444,42.224 C113.953333,42.224 113.510667,42.1946667 113.116,42.136 C112.721333,42.0773333 112.372,42.0053333 112.068,41.92 C111.764,41.8346667 111.502667,41.744 111.284,41.648 C111.065333,41.552 110.881333,41.4613333 110.732,41.376 L111.436,39.392 C111.766667,39.5733333 112.174667,39.736 112.66,39.88 C113.145333,40.024 113.74,40.096 114.444,40.096 C114.796,40.096 115.086667,40.0666667 115.316,40.008 C115.545333,39.9493333 115.729333,39.8693333 115.868,39.768 C116.006667,39.6666667 116.102667,39.5466667 116.156,39.408 C116.209333,39.2693333 116.236,39.1146667 116.236,38.944 C116.236,38.5813333 116.065333,38.28 115.724,38.04 C115.382667,37.8 114.796,37.5413333 113.964,37.264 C113.601333,37.136 113.238667,36.9893333 112.876,36.824 C112.513333,36.6586667 112.188,36.4506667 111.9,36.2 C111.612,35.9493333 111.377333,35.6453333 111.196,35.288 C111.014667,34.9306667 110.924,34.496 110.924,33.984 C110.924,33.472 111.02,33.0106667 111.212,32.6 C111.404,32.1893333 111.676,31.84 112.028,31.552 C112.38,31.264 112.806667,31.0426667 113.308,30.888 C113.809333,30.7333333 114.374667,30.656 115.004,30.656 Z M137.74,33.36 C138.348,33.36 138.905333,33.4666667 139.412,33.68 C139.918667,33.8933333 140.353333,34.192 140.716,34.576 C141.078667,34.96 141.361333,35.424 141.564,35.968 C141.766667,36.512 141.868,37.1146667 141.868,37.776 C141.868,38.4373333 141.772,39.0426667 141.58,39.592 C141.388,40.1413333 141.110667,40.6106667 140.748,41 C140.385333,41.3893333 139.950667,41.6906667 139.444,41.904 C138.937333,42.1173333 138.369333,42.224 137.74,42.224 C137.121333,42.224 136.558667,42.1173333 136.052,41.904 C135.545333,41.6906667 135.110667,41.3893333 134.748,41 C134.385333,40.6106667 134.102667,40.1413333 133.9,39.592 C133.697333,39.0426667 133.596,38.4373333 133.596,37.776 C133.596,37.1146667 133.7,36.512 133.908,35.968 C134.116,35.424 134.404,34.96 134.772,34.576 C135.14,34.192 135.577333,33.8933333 136.084,33.68 C136.590667,33.4666667 137.142667,33.36 137.74,33.36 Z M77.628,33.36 C78.332,33.36 78.9186667,33.44 79.388,33.6 C79.8573333,33.76 80.2333333,33.9893333 80.516,34.288 C80.7986667,34.5866667 80.9986667,34.9493333 81.116,35.376 C81.2333333,35.8026667 81.292,36.2773333 81.292,36.8 L81.292,41.76 C80.9506667,41.8346667 80.476,41.9226667 79.868,42.024 C79.26,42.1253333 78.524,42.176 77.66,42.176 C77.116,42.176 76.6226667,42.128 76.18,42.032 C75.7373333,41.936 75.356,41.7786667 75.036,41.56 C74.716,41.3413333 74.4706667,41.056 74.3,40.704 C74.1293333,40.352 74.044,39.92 74.044,39.408 C74.044,38.9173333 74.1426667,38.5013333 74.34,38.16 C74.5373333,37.8186667 74.8013333,37.5466667 75.132,37.344 C75.4626667,37.1413333 75.8413333,36.9946667 76.268,36.904 C76.6946667,36.8133333 77.1373333,36.768 77.596,36.768 C77.9053333,36.768 78.18,36.7813333 78.42,36.808 C78.66,36.8346667 78.8546667,36.8693333 79.004,36.912 L79.004,36.688 C79.004,36.2826667 78.8813333,35.9573333 78.636,35.712 C78.3906667,35.4666667 77.964,35.344 77.356,35.344 C76.9506667,35.344 76.5506667,35.3733333 76.156,35.432 C75.7613333,35.4906667 75.42,35.5733333 75.132,35.68 L74.828,33.76 C74.9666667,33.7173333 75.14,33.672 75.348,33.624 C75.556,33.576 75.7826667,33.5333333 76.028,33.496 C76.2733333,33.4586667 76.532,33.4266667 76.804,33.4 C77.076,33.3733333 77.3506667,33.36 77.628,33.36 Z M103.42,33.392 C104.134667,33.392 104.729333,33.4853333 105.204,33.672 C105.678667,33.8586667 106.054667,34.1226667 106.332,34.464 C106.609333,34.8053333 106.806667,35.2106667 106.924,35.68 C107.041333,36.1493333 107.1,36.672 107.1,37.248 L107.1,42 L104.716,42 L104.716,37.536 C104.716,36.768 104.614667,36.224 104.412,35.904 C104.209333,35.584 103.830667,35.424 103.276,35.424 C103.105333,35.424 102.924,35.432 102.732,35.448 C102.54,35.464 102.369333,35.4826667 102.22,35.504 L102.22,42 L99.836,42 L99.836,33.872 C100.241333,33.7546667 100.764,33.6453333 101.404,33.544 C102.044,33.4426667 102.716,33.392 103.42,33.392 Z M86.844,33.584 C86.9293333,33.968 87.0226667,34.3866667 87.124,34.84 C87.2253333,35.2933333 87.332,35.76 87.444,36.24 C87.556,36.72 87.6733333,37.2026667 87.796,37.688 C87.9186667,38.1733333 88.044,38.64 88.172,39.088 C88.3106667,38.6186667 88.4466667,38.1386667 88.58,37.648 C88.7133333,37.1573333 88.8413333,36.6746667 88.964,36.2 C89.0866667,35.7253333 89.204,35.2666667 89.316,34.824 C89.428,34.3813333 89.5266667,33.968 89.612,33.584 L91.34,33.584 C91.4253333,33.968 91.5213333,34.3813333 91.628,34.824 C91.7346667,35.2666667 91.8466667,35.7253333 91.964,36.2 C92.0813333,36.6746667 92.204,37.1573333 92.332,37.648 C92.46,38.1386667 92.5933333,38.6186667 92.732,39.088 C92.86,38.64 92.988,38.1733333 93.116,37.688 C93.244,37.2026667 93.364,36.72 93.476,36.24 C93.588,35.76 93.6946667,35.2933333 93.796,34.84 C93.8973333,34.3866667 93.9906667,33.968 94.076,33.584 L96.556,33.584 C96.3213333,34.416 96.0786667,35.24 95.828,36.056 C95.5773333,36.872 95.332,37.6453333 95.092,38.376 C94.852,39.1066667 94.6173333,39.7813333 94.388,40.4 C94.1586667,41.0186667 93.948,41.552 93.756,42 L91.9,42 C91.6333333,41.1893333 91.372,40.384 91.116,39.584 C90.9453333,39.0506667 90.7841481,38.514963 90.6324444,37.9768889 L90.411,37.168 L90.1942222,37.9768889 C90.0460741,38.514963 89.892,39.0506667 89.732,39.584 C89.492,40.384 89.2386667,41.1893333 88.972,42 L87.116,42 C86.924,41.552 86.716,41.0186667 86.492,40.4 C86.268,39.7813333 86.036,39.1066667 85.796,38.376 C85.556,37.6453333 85.3106667,36.872 85.06,36.056 C84.8093333,35.24 84.5666667,34.416 84.332,33.584 L86.844,33.584 Z M124.956,29.584 L124.956,33.616 C125.116,33.5626667 125.321333,33.512 125.572,33.464 C125.822667,33.416 126.065333,33.392 126.3,33.392 C126.982667,33.392 127.550667,33.4853333 128.004,33.672 C128.457333,33.8586667 128.82,34.1226667 129.092,34.464 C129.364,34.8053333 129.556,35.2106667 129.668,35.68 C129.78,36.1493333 129.836,36.672 129.836,37.248 L129.836,42 L127.452,42 L127.452,37.536 C127.452,36.768 127.353333,36.224 127.156,35.904 C126.958667,35.584 126.593333,35.424 126.06,35.424 C125.846667,35.424 125.646667,35.4426667 125.46,35.48 C125.273333,35.5173333 125.105333,35.5573333 124.956,35.6 L124.956,42 L122.572,42 L122.572,29.968 L124.956,29.584 Z M66.108,30.784 C67.7613333,30.784 69.0306667,31.0746667 69.916,31.656 C70.8013333,32.2373333 71.244,33.1893333 71.244,34.512 C71.244,35.8453333 70.796,36.808 69.9,37.4 C69.004,37.992 67.724,38.288 66.06,38.288 L65.276,38.288 L65.276,42 L62.78,42 L62.78,31.072 C63.324,30.9653333 63.9,30.8906667 64.508,30.848 C65.116,30.8053333 65.6493333,30.784 66.108,30.784 Z M78.044,38.368 C77.82,38.368 77.6093333,38.3813333 77.412,38.408 C77.2146667,38.4346667 77.0413333,38.4853333 76.892,38.56 C76.7426667,38.6346667 76.6253333,38.736 76.54,38.864 C76.4546667,38.992 76.412,39.152 76.412,39.344 C76.412,39.7173333 76.5373333,39.976 76.788,40.12 C77.0386667,40.264 77.3826667,40.336 77.82,40.336 C78.0546667,40.336 78.2786667,40.3306667 78.492,40.32 C78.7053333,40.3093333 78.876,40.2933333 79.004,40.272 L79.004,38.464 C78.908,38.4426667 78.764,38.4213333 78.572,38.4 C78.38,38.3786667 78.204,38.368 78.044,38.368 Z M137.74,35.408 C137.196,35.408 136.774667,35.6186667 136.476,36.04 C136.177333,36.4613333 136.028,37.04 136.028,37.776 C136.028,38.512 136.177333,39.096 136.476,39.528 C136.774667,39.96 137.196,40.176 137.74,40.176 C138.284,40.176 138.702667,39.96 138.996,39.528 C139.289333,39.096 139.436,38.512 139.436,37.776 C139.436,37.04 139.289333,36.4613333 138.996,36.04 C138.702667,35.6186667 138.284,35.408 137.74,35.408 Z M149.132,35.424 C148.918667,35.424 148.721333,35.432 148.54,35.448 C148.358667,35.464 148.209333,35.4826667 148.092,35.504 L148.092,39.808 C148.241333,39.904 148.436,39.984 148.676,40.048 C148.916,40.112 149.158667,40.144 149.404,40.144 C150.534667,40.144 151.1,39.3813333 151.1,37.856 C151.1,37.12 150.934667,36.5306667 150.604,36.088 C150.273333,35.6453333 149.782667,35.424 149.132,35.424 Z M25.5,12 C28.3113752,12 30.6000175,14.355948 30.6000175,17.25 C30.6000175,18.5814624 30.1155964,19.7990281 29.3187177,20.7256762 C30.0308747,21.0135297 30.3441053,21.3462851 30.4761906,21.5452103 L30.528146,21.632693 C30.5346254,21.6451388 30.5400989,21.6564485 30.5446925,21.6665184 C30.580817,21.7463632 30.5999414,21.8305816 30.5999414,21.9169868 L30.5999414,23.0840268 C30.5999414,23.2349636 30.543629,23.3793428 30.4426922,23.4876188 L30.3312923,23.5926413 C30.3155306,23.6062256 30.2981521,23.6207944 30.2790993,23.6362434 L30.1442311,23.7386682 C29.8584534,23.9427595 29.3561865,24.2281717 28.5609932,24.4563404 L28.337,24.517 L28.3395453,24.6501549 C28.4404543,27.5867377 29.6209141,30.5397705 30.54119,32.4204204 C30.6039356,32.4125813 30.6704316,32.4175886 30.7370779,32.435632 L30.9850744,32.5022632 L31.2694251,32.5862697 C31.3691812,32.6172043 31.4733665,32.6510895 31.5803513,32.6879801 L31.9080747,32.8077231 C32.9066619,33.1943293 34,33.8288108 34,34.751092 L34,37.084052 C34,37.1742869 33.97968,37.2632901 33.9412799,37.3432171 L33.891217,37.428069 L33.8310889,37.5061095 L33.7056957,37.6474102 L33.6161651,37.7380906 L33.5074869,37.840155 L33.3787172,37.9521264 L33.2289123,38.0725278 L33.0571283,38.1998821 L32.8624215,38.3327125 C32.8280076,38.3552251 32.7925994,38.3779044 32.756177,38.4007195 L32.5253163,38.5389944 L32.2691732,38.6790526 C32.2243234,38.7024623 32.1783809,38.7258846 32.1313259,38.749289 L31.8354897,38.889253 L31.5120117,39.0273079 C31.4557428,39.0500759 31.3982828,39.0727028 31.3396121,39.0951579 L30.9729017,39.2275797 C29.701056,39.6604702 27.9291885,40 25.5,40 C23.0708317,40 21.2989798,39.6604741 20.027142,39.2275884 L19.6604337,39.095168 C19.4844225,39.0278036 19.3193077,38.9588925 19.1645584,38.8892655 L18.8687231,38.749303 C18.8216682,38.7258989 18.7757257,38.7024768 18.730876,38.6790674 L18.474733,38.5390107 L18.2438717,38.4007374 L18.0373484,38.2657244 L17.8542193,38.1354489 L17.6935405,38.0113877 L17.5543681,37.895018 L17.3838698,37.7381156 L17.2564521,37.6068269 L17.1689298,37.5061368 L17.1030638,37.419856 C17.0361272,37.3214192 17,37.2032928 17,37.082988 L17,34.750028 C17,33.8277468 18.0933512,33.19326 19.0919373,32.8066541 L19.4196598,32.6869115 C19.473152,32.6684663 19.5259442,32.6507725 19.5778328,32.6338232 L19.8766907,32.5410069 L20.1440821,32.465731 C20.1854819,32.4546285 20.2251631,32.4442431 20.2629221,32.434568 C20.327785,32.4165095 20.3932487,32.4115105 20.4567751,32.4179563 L20.5800892,32.1627705 L20.8330729,31.6169806 C20.8757127,31.5222689 20.9185135,31.4257469 20.9613602,31.3275089 L21.2180694,30.7182432 C21.94175,28.9379239 22.6121064,26.716221 22.6631624,24.5167942 C21.8274846,24.303583 21.2823652,24.0227894 20.9547928,23.8062656 L20.797253,23.6953281 C20.774446,23.678165 20.7533271,23.6617312 20.7338415,23.6461257 L20.6360896,23.5632254 L20.5572025,23.486552 C20.4562657,23.3782704 20.3999534,23.2338968 20.3999534,23.08296 L20.3999534,21.91592 C20.3999534,21.8295148 20.4190783,21.7452964 20.4541414,21.6676384 L20.4707109,21.6337834 L20.522764,21.5462095 C20.6550935,21.3470592 20.968778,21.0138275 21.6801126,20.7252938 C20.8844014,19.7990281 20.399986,18.5814624 20.399986,17.25 C20.399986,14.355948 22.6886283,12 25.5,12 Z M31.2778412,33.8197446 L31.5205771,34.2372889 L31.6379564,34.429316 C31.7973326,34.6775976 31.7505811,35.010092 31.5253317,35.200408 L31.46524,35.2480988 L31.3447328,35.3321927 L31.1608789,35.4437375 L31.0006484,35.5298034 L30.8085611,35.6227479 C30.7738095,35.6386936 30.7376688,35.6548372 30.7001082,35.6711344 L30.4574585,35.7704056 L30.1792491,35.8712336 C29.2898005,36.1739244 27.9003019,36.4688954 25.8307998,36.4975092 L25.5000018,36.5 C23.7695025,36.5 22.4892972,36.317184 21.5642708,36.0880048 L21.2129777,35.9941839 C21.1575108,35.9782428 21.1035662,35.9621764 21.0511156,35.9460254 L20.7541147,35.848425 C20.7075275,35.8320966 20.6623779,35.8157643 20.6186378,35.7994684 L20.3728855,35.7024552 L20.159608,35.6082593 L19.9774525,35.5188212 L19.8250663,35.4360817 L19.6493454,35.3287774 L19.5329962,35.2474611 L19.4724632,35.19954 C19.2741298,35.0303727 19.2143151,34.7488581 19.3146596,34.5140156 L19.3668936,34.4174008 L19.5884889,34.0492957 L19.7201908,33.8201654 C18.8404479,34.1416235 18.1794701,34.5438623 18.1326115,34.755488 L18.1336742,36.863132 L18.2926483,37.011282 L18.4028809,37.1027461 L18.6096222,37.2572123 L18.7765796,37.3693871 L18.9680689,37.4870671 L19.1851428,37.608664 C19.2618818,37.6496728 19.3430603,37.6910697 19.4288538,37.73259 L19.7002545,37.8572569 C20.84264,38.3552887 22.6748404,38.832988 25.5,38.832988 C28.2001275,38.832988 29.9931117,38.3961502 31.1443501,37.9216645 L31.4302901,37.797294 L31.688162,37.6727904 L31.9190128,37.5497285 C31.9552943,37.5294258 31.9904936,37.5092488 32.0246325,37.4892303 L32.2169148,37.3712836 L32.3847936,37.2587157 L32.5293159,37.1531015 L32.6515287,37.0560157 L32.752479,36.9690331 L32.8663277,36.860948 L32.8663277,34.75 C32.8194216,34.5433085 32.1581366,34.1417626 31.2778412,33.8197446 Z M66.268,32.912 C66.0866667,32.912 65.908,32.9173333 65.732,32.928 C65.556,32.9386667 65.404,32.9493333 65.276,32.96 L65.276,36.16 L66.06,36.16 C66.924,36.16 67.5746667,36.0426667 68.012,35.808 C68.4493333,35.5733333 68.668,35.136 68.668,34.496 C68.668,34.1866667 68.612,33.9306667 68.5,33.728 C68.388,33.5253333 68.228,33.3626667 68.02,33.24 C67.812,33.1173333 67.5586667,33.032 67.26,32.984 C66.9613333,32.936 66.6306667,32.912 66.268,32.912 Z M27.2088784,24.7284102 L26.9718811,24.7576539 C26.6203178,24.7957018 26.2369145,24.821069 25.8194308,24.8296939 L25.5000018,24.83296 C24.855602,24.83296 24.2873427,24.7939339 23.7879211,24.7291076 C23.7018735,27.1004153 22.9856007,29.4358384 22.2243369,31.2862633 L21.9831249,31.8539624 L21.7430173,32.3862748 L21.5081097,32.8800578 L21.2824975,33.3321683 L21.0702764,33.7394633 L20.786012,34.2595018 L20.6251864,34.541008 L20.800039,34.6176142 L21.0077356,34.6990644 L21.2495818,34.7833158 L21.5268836,34.8683258 L21.8409466,34.9520516 L22.1930766,35.0324505 C22.6266086,35.1235141 23.1405266,35.2036149 23.7441617,35.2581558 L24.2837522,35.2983052 C24.6584171,35.3204445 25.0632478,35.332876 25.4999854,35.332876 C27.5440718,35.332876 28.8894049,35.0590937 29.7148807,34.7930093 L29.9710307,34.7049857 L30.1901452,34.619849 C30.2571744,34.5922087 30.3182763,34.5654357 30.3736965,34.539916 L30.2128746,34.2582562 L29.9286119,33.7380612 L29.6049914,33.1100381 L29.3742001,32.6366836 C29.3350161,32.5543644 29.2955296,32.4703754 29.2558259,32.384782 L29.0156783,31.8524918 C28.1708115,29.9257541 27.3053344,27.3491611 27.2088784,24.7284102 Z M152.558411,7.8203125 L151.4791,12.0625 L146.065037,12.0625 L142.773438,25 L137.464844,25 L140.756444,12.0625 L135.342381,12.0625 L136.421692,7.8203125 L152.558411,7.8203125 Z M117.769348,7.8203125 L116.830169,11.5117188 L109.0372,11.5117188 L108.273931,14.5117188 L114.930181,14.5117188 L114.04765,17.9804688 L107.3914,17.9804688 L105.605469,25 L100.273437,25 L104.644348,7.8203125 L117.769348,7.8203125 Z M72.6209106,7.8203125 L76.6716466,17.3242188 L79.0896606,7.8203125 L84.0935669,7.8203125 L79.7226562,25 L74.71875,25 L70.6852811,15.5664062 L68.2851562,25 L63.2929687,25 L67.6638794,7.8203125 L72.6209106,7.8203125 Z M28.3212597,21.6211331 L28.2438651,21.6733098 C27.4510633,22.1964064 26.5092128,22.5 25.5000018,22.5 C24.4581701,22.5 23.48813,22.1764695 22.6797429,21.6219167 C22.1759278,21.7510103 21.86786,21.9014771 21.6870182,22.0173966 L21.574171,22.0969848 C21.5589821,22.1088786 21.5455134,22.1200143 21.5336311,22.1302824 L21.5336311,22.7996504 L21.7079243,22.9076086 L21.8634075,22.9910758 C21.8920476,23.005552 21.9220721,23.0202704 21.9535132,23.0351706 L22.1594154,23.1262699 C22.7924235,23.3878272 23.8533729,23.6670064 25.4999474,23.6670064 C27.2098693,23.6670064 28.2886053,23.3662818 28.9132513,23.0952291 L29.115148,23.0013335 L29.281065,22.9131299 C29.3058157,22.899083 29.3291393,22.8854077 29.3510719,22.8721714 L29.4662636,22.7985584 L29.4662636,22.1204264 L29.3901551,22.0630297 C29.3743632,22.0519786 29.3569459,22.0402476 29.3377958,22.0279301 L29.2012405,21.9477379 C29.0156587,21.847719 28.7346278,21.7281442 28.3212597,21.6211331 Z M25.5000018,13.16704 C23.312299,13.16704 21.5336855,14.99908 21.5336855,17.25 C21.5336855,18.5591636 22.1347539,19.7260153 23.0678307,20.4735988 C23.1240691,20.5010878 23.174497,20.5391302 23.2179925,20.5848314 C23.8623456,21.0567663 24.6503223,21.33296 25.5000018,21.33296 C26.3483814,21.33296 27.1352469,21.0574422 27.780722,20.5888231 C27.822226,20.5414931 27.8723194,20.5033308 27.9269973,20.4741323 C28.8635433,19.7287803 29.466318,18.5603686 29.466318,17.25 C29.466318,14.99796 27.6876773,13.16704 25.5000018,13.16704 Z M25.500029,14.33296 C25.8123947,14.33296 26.0663347,14.5943652 26.0663347,14.91592 C26.0663347,15.238564 25.8123975,15.499972 25.500029,15.499972 C24.5629045,15.499972 23.8000237,16.285288 23.8000237,17.249972 C23.8000237,17.571524 23.5460865,17.83296 23.233718,17.83296 C22.9202642,17.83296 22.6663242,17.5715548 22.6663242,17.25 C22.6663242,15.642184 23.9370849,14.33296 25.500029,14.33296 Z" id="nftpawnshop-logo" fill="#ffffff" fill-rule="nonzero"></path>
    </svg>
  </div>
);

export default App;
