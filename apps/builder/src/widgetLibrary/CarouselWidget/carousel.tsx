import { FC, useCallback, useEffect, useMemo } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { NextIcon, PreviousIcon } from "@illa-design/react"
import { buttonLayoutStyle } from "@/widgetLibrary/ButtonWidget/style"
import {
  fullHeightStyle,
  fullImageStyle,
  sliderStyle,
} from "@/widgetLibrary/CarouselWidget/style"
import { formatData } from "@/widgetLibrary/CarouselWidget/utils"
import { TooltipWrapper } from "@/widgetLibrary/PublicSector/TooltipWrapper"
import { CarouselProps, CarouselWidgetProps } from "./interface"

export const Carousel: FC<CarouselProps> = (props) => {
  const {
    onClickItem,
    showArrows,
    showDots,
    autoPlay,
    data,
    disabled,
    interval,
  } = props

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Slider
      centerMode
      centerPadding={"0px"}
      css={sliderStyle}
      draggable={false}
      dots={showDots}
      arrows={showArrows}
      autoplay={autoPlay}
      autoplaySpeed={interval}
      prevArrow={<PreviousIcon />}
      nextArrow={<NextIcon />}
      lazyLoad={"anticipated"}
    >
      {data.map((item, index) => {
        const { id, label, url, alt, hidden, disabled } = item
        if (hidden) return null
        return (
          <div
            css={fullHeightStyle}
            key={id}
            onClick={() => {
              !disabled && onClickItem?.(index)
            }}
          >
            <img css={fullImageStyle} src={url} alt={alt} />
          </div>
        )
      })}
    </Slider>
  )
}

Carousel.displayName = "Carousel"

export const CarouselWidget: FC<CarouselWidgetProps> = (props) => {
  const {
    handleUpdateGlobalData,
    handleDeleteGlobalData,
    displayName,
    tooltipText,
    triggerEventHandler,
    manualData,
    mappedData,
    configureMode,
    showArrows,
    showDots,
    autoPlay,
    interval,
  } = props

  const handleOnClickItem = useCallback(
    (index: number) => {
      const path =
        configureMode === "static"
          ? `manualData.${index}.events`
          : `mappedData.events`
      triggerEventHandler("click", path)
    },
    [configureMode, triggerEventHandler],
  )

  const data = useMemo(() => {
    if (configureMode === "static") {
      return manualData
    }
    console.log(
      mappedData ? formatData(mappedData) : [],
      mappedData,
      "mappedData",
    )
    return mappedData ? formatData(mappedData) : []
  }, [manualData, mappedData, configureMode])

  useEffect(() => {
    handleUpdateGlobalData(displayName, {})
    return () => {
      handleDeleteGlobalData(displayName)
    }
  }, [handleUpdateGlobalData, displayName, handleDeleteGlobalData])

  const handleOnClick = useCallback(() => {
    triggerEventHandler("click")
  }, [triggerEventHandler])

  return (
    <TooltipWrapper tooltipText={tooltipText} tooltipDisabled={!tooltipText}>
      <div css={buttonLayoutStyle}>
        <Carousel
          // autoPlay change need to reload Carousel
          key={Number(autoPlay)}
          data={data ?? []}
          handleOnClick={handleOnClick}
          showArrows={showArrows}
          showDots={showDots}
          autoPlay={autoPlay}
          interval={interval}
          onClickItem={handleOnClickItem}
        />
      </div>
    </TooltipWrapper>
  )
}

CarouselWidget.displayName = "CarouselWidget"
