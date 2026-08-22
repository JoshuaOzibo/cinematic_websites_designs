import { createPortal } from 'react-dom'
export default function TransferCup({ product, products, refs }) {
  return createPortal(
    <div className="transfer-layer" ref={refs.layer} aria-hidden="true">
      <div className="transfer-cup" ref={refs.cup}>
        <div className="transfer-cup-tilt" ref={refs.tilt}>
          <div className="transfer-cup-crop" ref={refs.crop}>
            {products.map((entry) => {
              const isFlying = entry.id === product.id

              return (
                <img
                  key={entry.id}
                  src={entry.image}
                  alt=""
                  className={`transfer-cup-img${isFlying ? '' : ' transfer-cup-img--morph'}`}
                  width={entry.width}
                  height={entry.height}
                  style={isFlying ? { height: `calc(var(--cup-h) * ${entry.sizeFactor})` } : undefined}
                  draggable="false"
                  ref={isFlying ? refs.image : refs.byId[entry.id]}
                />
              )
            })}
            <span className="transfer-cup-shadow" ref={refs.shadow} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
