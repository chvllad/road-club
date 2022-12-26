const bikesData = {
  highway: [
    {
      image: 'images/bikes/cervelo-caledonia-5.jpg',
      name: 'Cervelo Caledonia-5',
      url: 'https://www.sigmasports.com/item/Cervelo/Caledonia-5-Ultegra-Disc-Road-Bike-2021/RDEN',
    },
    {
      image: 'images/bikes/cannondale-systemsix-himod.jpg',
      name: 'Cannondale Systemsix Himod',
      url: 'https://www.sigmasports.com/item/Cannondale/SystemSix-HiMOD-Ultegra-Di2-Disc-Road-Bike-2021/R82J',
    },
    {
      image: 'images/bikes/trek-domane-sl-7.jpg',
      name: 'Trek Domane SL-7',
      url: 'https://www.sigmasports.com/item/Trek/Domane-SL-7-Force-eTap-AXS-Disc-Road-Bike-2021/RULF',
    },
  ],
  gravel: [
    {
      image: 'images/bikes/cervelo-aspero-grx-810.jpg',
      name: 'Cervelo Aspero GRX 810',
      url: 'https://www.sigmasports.com/item/Cervelo/Aspero-GRX-810-1x-Disc-Gravel-Bike-2021/RJDE',
    },
    {
      image: 'images/bikes/specialized-s-works-diverge.jpg',
      name: 'Specialized S-Works Diverge',
      url: 'https://www.sigmasports.com/item/Specialized/S-Works-Diverge-Gravel-Bike-2020/NVJ9',
    },
    {
      image: 'images/bikes/cannondale-topstone-lefty-3.jpg',
      name: 'Cannondale Topstone Lefty 3',
      url: 'https://www.sigmasports.com/item/Cannondale/Topstone-Carbon-Lefty-3-Disc-Gravel-Road-Bike-2021/PUC8',
    },
  ],
  tt: [
    {
      image: 'images/bikes/specialized-s-works-shiv.jpg',
      name: 'Specialized S-Works Shiv',
      url: 'https://www.sigmasports.com/item/Specialized/S-Works-Shiv-Disc-Limited-Edition-Triathlon-Bike-2019/K8P9 ',
    },
    {
      image: 'images/bikes/bmv-timemachine-01-one.jpg',
      name: 'BMC Timemachine 01 ONE',
      url: 'https://www.sigmasports.com/item/BMC/Timemachine-01-One-Force-Disc-TT-Triathlon-Bike-2021/S835',
    },
    {
      image: 'images/bikes/cervelo-p-series.jpg',
      name: 'Cervelo P-Series',
      url: 'https://www.sigmasports.com/item/Cervelo/P-Series-Ultegra-Di2-TT-Triathlon-Bike-2021/RM6Q',
    },
  ],
};

const initBikesMenu = () => {
  const wrap = document.querySelector('.bikes__types-wrap');
  const menuItems = [...document.querySelectorAll('.bikes__types-item')];
  const bikesItems = [...document.querySelectorAll('.bikes__item')];

  menuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const el = e.target.closest('.bikes__types-item');
      if (!el.classList.contains('bikes__types-item_active')) {
        const lastEl = document.querySelector('.bikes__types-item_active');
        if (lastEl) {
          lastEl.classList.remove('bikes__types-item_active');
        }
        el.classList.add('bikes__types-item_active');

        wrap.setAttribute('style', 'pointer-events: none;');

        setTimeout(() => wrap.removeAttribute('style'), 20);

        const name = el.getAttribute('data-name');

        const data = bikesData[name];

        bikesItems.forEach((bEl, idx) => {
          const bData = data[idx];
          const img = bEl.querySelector('.bikes__image');
          const link = bEl.querySelector('.bikes__link');
          const caption = bEl.querySelector('.bikes__name');

          img.src = bData.image;
          img.alt = bData.name.toLowerCase();
          link.href = bData.url;
          caption.textContent = bData.name;
        });
      }
    });
  });
};

export default initBikesMenu;
