"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function MovingBorder({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  [key: string]: any
}) {
  const pathRef = useRef<any>()
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y)

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        <div className="h-4 w-4 rounded-full bg-primary blur-[2px]" />
      </motion.div>
      {children}
    </>
  )
}

export function Button({
  borderRadius = "1.75rem",
  children,
  href,
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string
  children: React.ReactNode
  href?: string
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
  [key: string]: any
}) {
  const Component = href ? Link : "button"
  const componentProps = href ? { href } : { type: "button" }

  return (
    <Component
      className={cn("relative h-12 w-full overflow-hidden bg-transparent p-[1px] text-base", containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
      {...componentProps}
      {...otherProps}
    >
      <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <MovingBorder duration={duration} rx="50%" ry="50%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(var(--color-primary)_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center gap-2 border border-border bg-card text-sm font-medium text-foreground antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}
