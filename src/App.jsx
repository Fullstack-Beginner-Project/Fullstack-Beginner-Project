import './assets/css/reset.css';
import './assets/css/common.css';
import './assets/css/Modal.css';

// import ModalInvest from './components/ModalInvest';
// import ModalDelete from './components/ModalDelete';
import ModalConfirm from './components/ModalConfirm';

const mockCompany = {
  id: 1,
  name: '블루코드',
  category: '기계장비',
  logo: '/images/bluecode.png',
};
function App() {

  return (
    // <ModalInvest
    //   company={mockCompany}
    //   onClose={() => {}}
    //   onInvest={(form) => {
    //     console.log(form);
    //   }}
    // />

    <ModalConfirm/>
  );
}

export default App
