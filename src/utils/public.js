export const createUrl = () => {

}
export const createLinkToClick = link => {
    let aLink = document.createElement('a');
    aLink.href = link;
    aLink.target = '_blank';
    aLink.style.display = 'none';
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
  };